const { randomUUID } = require('crypto')
const OhHellGame = require('./OhHellGame')

const CHARS    = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const STALE_MS = 2 * 60 * 60 * 1000  // 2 hours

function roomCode() {
  return Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

/**
 * GameManager — singleton that manages all concurrent rooms.
 * Maps roomId → OhHellGame and playerId → roomId.
 */
class GameManager {
  constructor() {
    this.rooms      = new Map()   // roomId  → OhHellGame
    this.playerRoom = new Map()   // playerId → roomId

    // Purge stale rooms every 30 minutes
    setInterval(() => this.cleanup(), 30 * 60 * 1000)
  }

  createRoom(hostName, maxPlayers) {
    let roomId
    do { roomId = roomCode() } while (this.rooms.has(roomId))

    const playerId = randomUUID()
    const game     = new OhHellGame(roomId, maxPlayers)
    game.addPlayer(playerId, hostName)

    this.rooms.set(roomId, game)
    this.playerRoom.set(playerId, roomId)

    return { roomId, playerId }
  }

  joinRoom(roomId, playerName) {
    const game = this.rooms.get(roomId)
    if (!game) throw new Error('Room not found')

    const playerId = randomUUID()
    game.addPlayer(playerId, playerName)
    this.playerRoom.set(playerId, roomId)

    return { playerId }
  }

  getGame(roomId)           { return this.rooms.get(roomId) ?? null }
  getRoomByPlayer(playerId) { return this.playerRoom.get(playerId) ?? null }

  getGameByPlayer(playerId) {
    const roomId = this.playerRoom.get(playerId)
    return roomId ? this.rooms.get(roomId) : null
  }

  disconnectPlayer(playerId) {
    this.getGameByPlayer(playerId)?.setConnected(playerId, false)
  }

  reconnectPlayer(playerId) {
    this.getGameByPlayer(playerId)?.setConnected(playerId, true)
  }

  listOpenRooms() {
    return [...this.rooms.values()]
      .filter(g => g.phase === 'waiting')
      .map(g => ({
        roomId:      g.roomId,
        playerCount: g.players.length,
        maxPlayers:  g.maxPlayers,
        hostName:    g.players.find(p => p.id === g.hostId)?.name ?? '?',
      }))
  }

  cleanup() {
    const cutoff = Date.now() - STALE_MS
    for (const [roomId, game] of this.rooms) {
      if (game.lastActivity < cutoff) {
        for (const p of game.players) this.playerRoom.delete(p.id)
        this.rooms.delete(roomId)
        console.log(`[cleanup] Removed stale room ${roomId}`)
      }
    }
  }
}

module.exports = new GameManager()
