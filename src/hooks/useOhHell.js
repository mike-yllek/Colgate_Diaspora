import { io } from 'socket.io-client'
import { useState, useEffect, useCallback, useRef } from 'react'

const SUIT_ORDER = { '♠': 0, '♥': 1, '♦': 2, '♣': 3 }
const RANK_ORDER = { '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14 }

function sortHand(cards) {
  return [...cards].sort((a, b) => {
    const sd = SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit]
    if (sd !== 0) return sd
    return RANK_ORDER[b.rank] - RANK_ORDER[a.rank]
  })
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

// Module-level singleton — survives React page navigation
let _socket = null

function getSocket() {
  if (!_socket) {
    _socket = io(SOCKET_URL, {
      autoConnect:         true,
      reconnectionAttempts: 10,
      reconnectionDelay:   1000,
      // Send stored playerId on reconnect so the server can restore our session
      auth: { playerId: localStorage.getItem('oh_hell_player_id') },
    })
  }
  return _socket
}

/**
 * useOhHell — React hook for the Oh Hell! multiplayer game.
 *
 * Manages the Socket.io connection and exposes game state + action helpers.
 * The socket is a module-level singleton so it persists between page navigations
 * (lobby → game room). Listeners are scoped to each hook instance and cleaned
 * up on unmount.
 */
export function useOhHell() {
  const [isConnected,  setIsConnected]  = useState(false)
  const [gameState,    setGameState]    = useState(null)
  const [myHand,       setMyHand]       = useState([])
  const [myPlayerId,   setMyPlayerId]   = useState(() => localStorage.getItem('oh_hell_player_id'))
  const serverHandRef = useRef([])  // original server order, used for index lookup on play
  const [openRooms,    setOpenRooms]    = useState([])
  const [error,        setError]        = useState(null)
  const [myTurnPhase,  setMyTurnPhase]  = useState(null)   // 'bid' | 'play' | null
  const [roundSummary, setRoundSummary] = useState(null)
  const [finalResult,  setFinalResult]  = useState(null)

  useEffect(() => {
    const socket = getSocket()

    const onConnect = () => {
      setIsConnected(true)
      socket.emit('get_rooms')
    }
    const onDisconnect = () => {
      setIsConnected(false)
      setMyTurnPhase(null)
    }
    const onStateUpdate = ({ publicState }) => {
      setGameState(publicState)
      // Clear the round summary once a new state comes in (next round started)
      if (publicState.phase === 'bidding') setRoundSummary(null)
    }
    const onYourHand = ({ cards }) => {
      serverHandRef.current = cards
      setMyHand(sortHand(cards))
    }
    const onYourTurn = ({ phase }) => setMyTurnPhase(phase)

    const onRoundEnd = ({ roundSummary: rs }) => setRoundSummary(rs)
    const onGameEnd  = ({ finalScores, winner }) => {
      setFinalResult({ finalScores, winner })
      setMyTurnPhase(null)
    }
    const onRoomsList = ({ rooms }) => setOpenRooms(rooms)
    const onError = ({ message }) => {
      setError(message)
      setTimeout(() => setError(null), 5000)
    }

    socket.on('connect',           onConnect)
    socket.on('disconnect',        onDisconnect)
    socket.on('game_state_update', onStateUpdate)
    socket.on('your_hand',         onYourHand)
    socket.on('your_turn',         onYourTurn)
    socket.on('round_end',         onRoundEnd)
    socket.on('game_end',          onGameEnd)
    socket.on('rooms_list',        onRoomsList)
    socket.on('error',             onError)

    if (socket.connected) onConnect()

    return () => {
      socket.off('connect',           onConnect)
      socket.off('disconnect',        onDisconnect)
      socket.off('game_state_update', onStateUpdate)
      socket.off('your_hand',         onYourHand)
      socket.off('your_turn',         onYourTurn)
      socket.off('round_end',         onRoundEnd)
      socket.off('game_end',          onGameEnd)
      socket.off('rooms_list',        onRoomsList)
      socket.off('error',             onError)
    }
  }, [])

  // ── Actions ──────────────────────────────────────────────────────

  const createRoom = useCallback((playerName, maxPlayers) => {
    return new Promise((resolve, reject) => {
      const socket = getSocket()
      let timer
      const onCreated = ({ roomId, playerId }) => {
        clearTimeout(timer)
        setMyPlayerId(playerId)
        localStorage.setItem('oh_hell_player_id',   playerId)
        localStorage.setItem('oh_hell_player_name', playerName)
        localStorage.setItem('oh_hell_room_id',     roomId)
        cleanup()
        resolve({ roomId, playerId })
      }
      const onErr = ({ message }) => { clearTimeout(timer); cleanup(); reject(new Error(message)) }
      const cleanup = () => {
        socket.off('room_created', onCreated)
        socket.off('error',        onErr)
      }
      timer = setTimeout(() => { cleanup(); reject(new Error('Server not responding — is the game server running?')) }, 8000)
      socket.once('room_created', onCreated)
      socket.once('error',        onErr)
      socket.emit('create_room', { playerName, maxPlayers })
    })
  }, [])

  const joinRoom = useCallback((roomId, playerName) => {
    return new Promise((resolve, reject) => {
      const socket = getSocket()
      let timer
      const onJoined = ({ playerId, roomId: rid }) => {
        clearTimeout(timer)
        setMyPlayerId(playerId)
        localStorage.setItem('oh_hell_player_id',   playerId)
        localStorage.setItem('oh_hell_player_name', playerName)
        localStorage.setItem('oh_hell_room_id',     rid)
        cleanup()
        resolve({ playerId, roomId: rid })
      }
      const onErr = ({ message }) => { clearTimeout(timer); cleanup(); reject(new Error(message)) }
      const cleanup = () => {
        socket.off('room_joined', onJoined)
        socket.off('error',       onErr)
      }
      timer = setTimeout(() => { cleanup(); reject(new Error('Server not responding — is the game server running?')) }, 8000)
      socket.once('room_joined', onJoined)
      socket.once('error',       onErr)
      socket.emit('join_room', { roomId, playerName })
    })
  }, [])

  const startGame = useCallback((roomId) => {
    getSocket().emit('start_game', { roomId })
  }, [])

  const placeBid = useCallback((roomId, bid) => {
    setMyTurnPhase(null)
    getSocket().emit('place_bid', { roomId, bid })
  }, [])

  const playCard = useCallback((roomId, card) => {
    const cardIndex = serverHandRef.current.findIndex(c => c.rank === card.rank && c.suit === card.suit)
    if (cardIndex === -1) return
    setMyTurnPhase(null)
    getSocket().emit('play_card', { roomId, cardIndex })
  }, [])

  const nextRound = useCallback((roomId) => {
    getSocket().emit('next_round', { roomId })
  }, [])

  const refreshRooms = useCallback(() => {
    getSocket().emit('get_rooms')
  }, [])

  return {
    isConnected,
    gameState,
    myHand,
    myPlayerId,
    openRooms,
    error,
    myTurnPhase,
    roundSummary,
    finalResult,
    createRoom,
    joinRoom,
    startGame,
    placeBid,
    playCard,
    nextRound,
    refreshRooms,
  }
}
