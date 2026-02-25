const express      = require('express')
const { createServer } = require('http')
const { Server }   = require('socket.io')
const cors         = require('cors')
const manager      = require('./game/GameManager')

const app        = express()
const httpServer = createServer(app)

const ORIGINS = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(s => s.trim())

app.use(cors({ origin: ORIGINS }))
app.get('/health', (_, res) => res.json({ status: 'ok', rooms: manager.rooms.size }))

const io = new Server(httpServer, {
  cors: { origin: ORIGINS, methods: ['GET', 'POST'] },
})

// ── Helpers ───────────────────────────────────────────────────────

function socketForPlayer(playerId) {
  for (const [, s] of io.sockets.sockets) {
    if (s.data.playerId === playerId) return s
  }
  return null
}

/** Send each player their private hand after a deal. */
function dealHands(game) {
  for (const player of game.players) {
    const s = socketForPlayer(player.id)
    if (s) s.emit('your_hand', { cards: game.getPlayerHand(player.id) })
  }
}

/** Emit 'your_turn' to whoever needs to move next. */
function notifyNextPlayer(game) {
  const pub = game.getPublicState()
  if (pub.phase === 'bidding' && pub.currentBidderId) {
    const s = socketForPlayer(pub.currentBidderId)
    if (s) s.emit('your_turn', { phase: 'bid', forbiddenBid: pub.forbiddenBid })
  } else if (pub.phase === 'playing' && pub.currentPlayerId) {
    const s = socketForPlayer(pub.currentPlayerId)
    if (s) s.emit('your_turn', { phase: 'play' })
  }
}

// ── Connection ────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`[+] ${socket.id}`)

  // Reconnection: client sends stored playerId in auth handshake
  const reconnectId = socket.handshake.auth?.playerId
  if (reconnectId) {
    const roomId = manager.getRoomByPlayer(reconnectId)
    if (roomId) {
      socket.data.playerId = reconnectId
      socket.data.roomId   = roomId
      socket.join(roomId)
      manager.reconnectPlayer(reconnectId)

      const game = manager.getGame(roomId)
      if (game) {
        const pub = game.getPublicState()
        socket.emit('your_hand',         { cards: game.getPlayerHand(reconnectId) })
        socket.emit('game_state_update', { publicState: pub })
        io.to(roomId).emit('game_state_update', { publicState: pub })

        // Resend your_turn if it's this player's move
        if (pub.currentBidderId === reconnectId)
          socket.emit('your_turn', { phase: 'bid', forbiddenBid: pub.forbiddenBid })
        else if (pub.currentPlayerId === reconnectId)
          socket.emit('your_turn', { phase: 'play' })
      }
    }
  }

  // ── create_room ─────────────────────────────────────────────────
  socket.on('create_room', ({ playerName, maxPlayers }) => {
    try {
      const { roomId, playerId } = manager.createRoom(playerName, maxPlayers || 6)
      socket.data.playerId = playerId
      socket.data.roomId   = roomId
      socket.join(roomId)

      socket.emit('room_created', { roomId, playerId })
      socket.emit('game_state_update', { publicState: manager.getGame(roomId).getPublicState() })
      io.emit('rooms_list', { rooms: manager.listOpenRooms() })
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })

  // ── join_room ───────────────────────────────────────────────────
  socket.on('join_room', ({ roomId, playerName }) => {
    try {
      const { playerId } = manager.joinRoom(roomId, playerName)
      socket.data.playerId = playerId
      socket.data.roomId   = roomId
      socket.join(roomId)

      const game = manager.getGame(roomId)
      const pub  = game.getPublicState()

      socket.emit('room_joined', { playerId, roomId })
      io.to(roomId).emit('player_joined',      { playerName, playerCount: game.players.length })
      io.to(roomId).emit('game_state_update',  { publicState: pub })
      io.emit('rooms_list', { rooms: manager.listOpenRooms() })
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })

  // ── start_game ──────────────────────────────────────────────────
  socket.on('start_game', ({ roomId }) => {
    try {
      const playerId = socket.data.playerId
      const game     = manager.getGame(roomId)
      if (!game) throw new Error('Room not found')

      game.startGame(playerId)
      dealHands(game)

      const pub = game.getPublicState()
      io.to(roomId).emit('game_started',      { publicState: pub })
      io.to(roomId).emit('game_state_update', { publicState: pub })
      io.emit('rooms_list', { rooms: manager.listOpenRooms() })
      notifyNextPlayer(game)
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })

  // ── place_bid ───────────────────────────────────────────────────
  socket.on('place_bid', ({ roomId, bid }) => {
    try {
      const playerId = socket.data.playerId
      const game     = manager.getGame(roomId)
      if (!game) throw new Error('Room not found')

      game.placeBid(playerId, bid)

      const pub = game.getPublicState()
      io.to(roomId).emit('bid_placed',        { playerId, bid, publicState: pub })
      io.to(roomId).emit('game_state_update', { publicState: pub })
      notifyNextPlayer(game)
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })

  // ── play_card ───────────────────────────────────────────────────
  socket.on('play_card', ({ roomId, cardIndex }) => {
    try {
      const playerId = socket.data.playerId
      const game     = manager.getGame(roomId)
      if (!game) throw new Error('Room not found')

      const result = game.playCard(playerId, cardIndex)

      if (result.roundComplete) {
        const pub = game.getPublicState()

        if (result.gameComplete) {
          const gameResult = game.endGame()
          io.to(roomId).emit('game_state_update', { publicState: game.getPublicState() })
          io.to(roomId).emit('round_end', { roundSummary: result.roundSummary })
          io.to(roomId).emit('game_end',  { finalScores: gameResult.finalScores, winner: gameResult.winner })
        } else {
          io.to(roomId).emit('game_state_update', { publicState: pub })
          io.to(roomId).emit('round_end', { roundSummary: result.roundSummary })
        }
      } else {
        const pub = game.getPublicState()
        io.to(roomId).emit('game_state_update', { publicState: pub })

        if (result.trickComplete) {
          io.to(roomId).emit('trick_won', {
            winnerId:   result.winnerId,
            winnerName: result.winnerName,
            trick:      result.trick,
          })
        }
        notifyNextPlayer(game)
      }
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })

  // ── next_round ──────────────────────────────────────────────────
  socket.on('next_round', ({ roomId }) => {
    try {
      const game = manager.getGame(roomId)
      if (!game) throw new Error('Room not found')
      if (game.phase !== 'round_end') return   // ignore duplicate clicks

      game.nextRound()
      dealHands(game)

      const pub = game.getPublicState()
      io.to(roomId).emit('game_state_update', { publicState: pub })
      notifyNextPlayer(game)
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })

  // ── get_rooms ───────────────────────────────────────────────────
  socket.on('get_rooms', () => {
    socket.emit('rooms_list', { rooms: manager.listOpenRooms() })
  })

  // ── disconnect ──────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[-] ${socket.id}`)
    const playerId = socket.data.playerId
    if (!playerId) return

    manager.disconnectPlayer(playerId)

    const roomId = socket.data.roomId
    if (roomId) {
      const game = manager.getGame(roomId)
      if (game) io.to(roomId).emit('game_state_update', { publicState: game.getPublicState() })
    }
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Oh Hell! server → port ${PORT}`))
