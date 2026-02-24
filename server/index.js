const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const GameManager = require('./game/GameManager')

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

const manager = new GameManager()

io.on('connection', (socket) => {
  console.log(`[+] Socket connected: ${socket.id}`)

  socket.on('join', ({ roomId, playerName }) => {
    socket.join(roomId)
    manager.addPlayer(roomId, socket.id, playerName)
    const state = manager.getState(roomId)
    io.to(roomId).emit('gameState', state)
    console.log(`[~] ${playerName} joined room ${roomId}`)
  })

  socket.on('startGame', ({ roomId }) => {
    manager.startGame(roomId)
    const state = manager.getState(roomId)
    io.to(roomId).emit('gameState', state)
  })

  socket.on('bid', ({ roomId, bid }) => {
    manager.placeBid(roomId, socket.id, bid)
    const state = manager.getState(roomId)
    io.to(roomId).emit('gameState', state)
  })

  socket.on('playCard', ({ roomId, card }) => {
    manager.playCard(roomId, socket.id, card)
    const state = manager.getState(roomId)
    io.to(roomId).emit('gameState', state)
  })

  socket.on('disconnect', () => {
    console.log(`[-] Socket disconnected: ${socket.id}`)
    manager.removePlayer(socket.id)
  })
})

app.get('/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Oh Hell! server running on port ${PORT}`)
})
