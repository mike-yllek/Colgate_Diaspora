const Deck = require('./Deck')

class OhHellGame {
  constructor(players) {
    this.deck = new Deck()
    this.players = players.map(p => ({ ...p, hand: [], bid: null, tricks: 0, score: 0 }))
    this.round = 1
    this.maxRound = Math.min(7, Math.floor(52 / players.length))
    this.phase = 'bidding'
    this.trump = null
    this.currentTrick = []
    this.leadSuit = null
    this.currentPlayerIdx = 0
    this.biddingPlayerIdx = 0
    this.dealerIdx = 0
  }

  dealRound() {
    this.deck.reset()
    this.deck.shuffle()
    const cardCount = this.round

    for (const player of this.players) {
      player.hand = this.deck.deal(cardCount)
      player.bid = null
      player.tricks = 0
    }

    const trumpCard = this.deck.flip()
    this.trump = trumpCard ? trumpCard.suit : null
    this.phase = 'bidding'
    this.currentTrick = []
    this.leadSuit = null
    this.biddingPlayerIdx = (this.dealerIdx + 1) % this.players.length
    this.currentPlayerIdx = this.biddingPlayerIdx
  }

  placeBid(playerId, bid) {
    const player = this.players.find(p => p.id === playerId)
    if (!player || this.phase !== 'bidding') return false
    if (this.players[this.biddingPlayerIdx].id !== playerId) return false

    player.bid = bid
    this.biddingPlayerIdx = (this.biddingPlayerIdx + 1) % this.players.length

    const allBid = this.players.every(p => p.bid !== null)
    if (allBid) {
      this.phase = 'playing'
      this.currentPlayerIdx = (this.dealerIdx + 1) % this.players.length
    }
    return true
  }

  playCard(playerId, card) {
    if (this.phase !== 'playing') return false
    const player = this.players[this.currentPlayerIdx]
    if (player.id !== playerId) return false

    const cardIdx = player.hand.findIndex(c => c.rank === card.rank && c.suit === card.suit)
    if (cardIdx === -1) return false

    player.hand.splice(cardIdx, 1)

    if (this.currentTrick.length === 0) {
      this.leadSuit = card.suit
    }

    this.currentTrick.push({ playerId, card })

    if (this.currentTrick.length === this.players.length) {
      this._resolveTrick()
    } else {
      this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length
    }
    return true
  }

  _resolveTrick() {
    let winner = this.currentTrick[0]
    for (let i = 1; i < this.currentTrick.length; i++) {
      const result = this.deck.compare(
        this.currentTrick[i].card,
        winner.card,
        this.leadSuit,
        this.trump
      )
      if (result > 0) winner = this.currentTrick[i]
    }

    const winnerPlayer = this.players.find(p => p.id === winner.playerId)
    if (winnerPlayer) winnerPlayer.tricks++

    this.currentTrick = []
    this.leadSuit = null
    this.currentPlayerIdx = this.players.findIndex(p => p.id === winner.playerId)

    const handsDone = this.players.every(p => p.hand.length === 0)
    if (handsDone) {
      this._scoreRound()
    }
  }

  _scoreRound() {
    for (const player of this.players) {
      if (player.bid === player.tricks) {
        player.score += 10 + player.tricks
      }
    }

    if (this.round >= this.maxRound) {
      this.phase = 'gameOver'
    } else {
      this.round++
      this.dealerIdx = (this.dealerIdx + 1) % this.players.length
      this.phase = 'roundEnd'
    }
  }

  startNextRound() {
    if (this.phase === 'roundEnd') {
      this.dealRound()
    }
  }

  getState() {
    return {
      phase: this.phase,
      round: this.round,
      maxRound: this.maxRound,
      trump: this.trump,
      currentTrick: this.currentTrick,
      currentPlayerId: this.players[this.currentPlayerIdx]?.id,
      players: this.players.map(({ id, name, bid, tricks, score, hand }) => ({
        id, name, bid, tricks, score,
        cardCount: hand.length,
      })),
    }
  }

  getPlayerState(playerId) {
    const base = this.getState()
    const player = this.players.find(p => p.id === playerId)
    return { ...base, hand: player?.hand || [] }
  }
}

module.exports = OhHellGame
