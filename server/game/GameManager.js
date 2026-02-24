const OhHellGame = require('./OhHellGame')

/**
 * GameManager — manages multiple concurrent game rooms.
 * Maps roomId → { game, players }
 */
class GameManager {
  constructor() {
    this.rooms = new Map()
    // Track socketId → roomId for cleanup on disconnect
    this.socketRoom = new Map()
  }

  _getOrCreateRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { game: null, players: [] })
    }
    return this.rooms.get(roomId)
  }

  addPlayer(roomId, socketId, name) {
    const room = this._getOrCreateRoom(roomId)
    if (room.game) return // game already started, ignore late joins for now
    if (!room.players.find(p => p.id === socketId)) {
      room.players.push({ id: socketId, name })
      this.socketRoom.set(socketId, roomId)
    }
  }

  startGame(roomId) {
    const room = this.rooms.get(roomId)
    if (!room || room.players.length < 2) return
    room.game = new OhHellGame(room.players)
    room.game.dealRound()
  }

  placeBid(roomId, socketId, bid) {
    const room = this.rooms.get(roomId)
    if (!room?.game) return
    room.game.placeBid(socketId, bid)
  }

  playCard(roomId, socketId, card) {
    const room = this.rooms.get(roomId)
    if (!room?.game) return
    room.game.playCard(socketId, card)
  }

  getState(roomId) {
    const room = this.rooms.get(roomId)
    if (!room) return null
    if (!room.game) {
      return {
        phase: 'waiting',
        players: room.players,
        round: 0,
        maxRound: 7,
        trump: null,
        currentTrick: [],
        hand: [],
      }
    }
    return room.game.getState()
  }

  removePlayer(socketId) {
    const roomId = this.socketRoom.get(socketId)
    if (!roomId) return
    const room = this.rooms.get(roomId)
    if (room) {
      room.players = room.players.filter(p => p.id !== socketId)
      if (room.players.length === 0) {
        this.rooms.delete(roomId)
      }
    }
    this.socketRoom.delete(socketId)
  }
}

module.exports = GameManager
