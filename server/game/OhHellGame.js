const Deck = require('./Deck')

/**
 * OhHellGame — complete Oh Hell! game logic for one room.
 *
 * Round structure: V-shape. Max hand size = floor(52 / players), capped at 10.
 * Rounds go: maxHand → maxHand-1 → … → 1 → 2 → … → maxHand.
 * Total rounds = (maxHand * 2) - 1.
 *
 * Scoring: hit your exact bid → bid + 10 pts. Miss → 0.
 * Dealer bids last and CANNOT bid such that total bids == handSize.
 */
class OhHellGame {
  constructor(roomId, maxPlayers = 6) {
    this.roomId     = roomId
    this.maxPlayers = Math.max(3, Math.min(10, maxPlayers))
    this.deck       = new Deck()

    // Players: [{ id, name, connected }]
    this.players = []
    this.hostId  = null

    // Phase: waiting | bidding | playing | round_end | game_over
    this.phase = 'waiting'

    // Round bookkeeping
    this.roundSizes = []   // V-shape hand sizes
    this.round      = 0    // 1-indexed
    this.maxRound   = 0
    this.handSize   = 0
    this.dealerIdx  = 0

    // Per-round state
    this.hands       = {}   // playerId → Card[]
    this.trump       = null // { suit, rank }
    this.bids        = {}   // playerId → number
    this.bidsPlaced  = 0
    this.bidderIdx   = 0    // index into this.players
    this.trickWins   = {}   // playerId → number
    this.tricksPlayed = 0

    // Current trick
    this.currentTrick     = []   // [{ playerId, playerName, card }]
    this.leadSuit         = null
    this.currentPlayerIdx = 0

    // Totals
    this.scores          = {}   // playerId → cumulative score
    this.lastRoundSummary = null

    this.lastActivity = Date.now()
  }

  // ── Player management ──────────────────────────────────────────

  addPlayer(playerId, playerName) {
    if (this.phase !== 'waiting')         throw new Error('Game already started')
    if (this.players.length >= this.maxPlayers) throw new Error('Room is full')
    if (this.players.find(p => p.id === playerId)) throw new Error('Already in room')

    const player = { id: playerId, name: playerName, connected: true }
    this.players.push(player)
    if (!this.hostId) this.hostId = playerId
    this.scores[playerId] = 0
    this.lastActivity = Date.now()
    return player
  }

  setConnected(playerId, connected) {
    const p = this.players.find(p => p.id === playerId)
    if (p) { p.connected = connected; this.lastActivity = Date.now() }
  }

  // ── Game lifecycle ─────────────────────────────────────────────

  startGame(requesterId) {
    if (requesterId !== this.hostId)      throw new Error('Only the host can start')
    if (this.players.length < 3)          throw new Error('Need at least 3 players')
    if (this.phase !== 'waiting')         throw new Error('Game already started')

    const maxHand = Math.min(10, Math.floor(52 / this.players.length))

    // Build V-shape: [maxHand, maxHand-1, …, 1, 2, …, maxHand]
    this.roundSizes = []
    for (let i = maxHand; i >= 1; i--) this.roundSizes.push(i)
    for (let i = 2; i <= maxHand; i++)  this.roundSizes.push(i)
    this.maxRound  = this.roundSizes.length
    this.dealerIdx = 0
    this.round     = 0

    this._startRound()
  }

  _startRound() {
    this.round++
    this.handSize = this.roundSizes[this.round - 1]

    // Deal fresh deck
    this.deck.reset()
    this.deck.shuffle()
    this.hands = {}
    for (const p of this.players) {
      this.hands[p.id] = this.deck.deal(this.handSize)
    }

    // Trump card — flip top of remaining deck (null if empty)
    this.trump = this.deck.cards.length > 0 ? { ...this.deck.cards[0] } : null

    // Reset round tracking
    this.bids         = {}
    this.bidsPlaced   = 0
    this.trickWins    = {}
    this.tricksPlayed = 0
    for (const p of this.players) this.trickWins[p.id] = 0
    this.currentTrick = []
    this.leadSuit     = null

    // Bidding starts left of dealer; dealer bids last
    const n = this.players.length
    this.bidderIdx       = (this.dealerIdx + 1) % n
    this.currentPlayerIdx = this.bidderIdx

    this.phase = 'bidding'
    this.lastActivity = Date.now()
  }

  // ── Bidding ────────────────────────────────────────────────────

  /**
   * Returns the forbidden bid for the dealer (last bidder), or null if no
   * restriction applies (either not the last bidder, or total already > handSize).
   */
  getForbiddenBid() {
    if (this.bidsPlaced < this.players.length - 1) return null  // not last bidder yet
    const total    = Object.values(this.bids).reduce((s, b) => s + b, 0)
    const forbidden = this.handSize - total
    return (forbidden >= 0 && forbidden <= this.handSize) ? forbidden : null
  }

  placeBid(playerId, bid) {
    if (this.phase !== 'bidding') throw new Error('Not in bidding phase')
    const bidder = this.players[this.bidderIdx]
    if (bidder.id !== playerId) throw new Error('Not your turn to bid')
    if (typeof bid !== 'number' || bid < 0 || bid > this.handSize) {
      throw new Error(`Bid must be 0–${this.handSize}`)
    }
    const forbidden = this.getForbiddenBid()
    if (forbidden !== null && bid === forbidden) {
      throw new Error(`Dealer cannot bid ${bid} — would make total equal tricks available`)
    }

    this.bids[playerId] = bid
    this.bidsPlaced++
    this.bidderIdx = (this.bidderIdx + 1) % this.players.length

    if (this.bidsPlaced === this.players.length) {
      this.phase = 'playing'
      this.currentPlayerIdx = (this.dealerIdx + 1) % this.players.length
      return { allBid: true }
    }
    return { allBid: false }
  }

  // ── Trick play ─────────────────────────────────────────────────

  playCard(playerId, cardIndex) {
    if (this.phase !== 'playing') throw new Error('Not in playing phase')
    if (this.players[this.currentPlayerIdx].id !== playerId) throw new Error('Not your turn')

    const hand = this.hands[playerId]
    if (!hand || cardIndex < 0 || cardIndex >= hand.length) throw new Error('Invalid card')

    const card = hand[cardIndex]

    // Must follow suit if able
    if (this.currentTrick.length > 0) {
      const led    = this.currentTrick[0].card.suit
      const hasSuit = hand.some(c => c.suit === led)
      if (hasSuit && card.suit !== led) throw new Error('Must follow suit')
    }

    hand.splice(cardIndex, 1)
    if (this.currentTrick.length === 0) this.leadSuit = card.suit

    const playerName = this.players[this.currentPlayerIdx].name
    this.currentTrick.push({ playerId, playerName, card })
    this.lastActivity = Date.now()

    if (this.currentTrick.length === this.players.length) {
      return this._resolveTrick()
    }

    this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length
    return { trickComplete: false }
  }

  _resolveTrick() {
    let winner = this.currentTrick[0]
    for (let i = 1; i < this.currentTrick.length; i++) {
      const cmp = this.deck.compare(
        this.currentTrick[i].card,
        winner.card,
        this.leadSuit,
        this.trump?.suit ?? null
      )
      if (cmp > 0) winner = this.currentTrick[i]
    }

    this.trickWins[winner.playerId] = (this.trickWins[winner.playerId] || 0) + 1
    this.tricksPlayed++

    const completedTrick = [...this.currentTrick]
    this.currentTrick = []
    this.leadSuit     = null
    this.currentPlayerIdx = this.players.findIndex(p => p.id === winner.playerId)

    const trickResult = {
      trickComplete: true,
      winnerId:   winner.playerId,
      winnerName: winner.playerName,
      trick:      completedTrick,
    }

    if (this.tricksPlayed >= this.handSize) {
      return { ...trickResult, ...this._scoreRound() }
    }
    return { ...trickResult, roundComplete: false }
  }

  _scoreRound() {
    const summary = this.players.map(p => {
      const bid        = this.bids[p.id]   ?? 0
      const tricks     = this.trickWins[p.id] ?? 0
      const hit        = bid === tricks
      const roundScore = hit ? bid + 10 : 0
      this.scores[p.id] = (this.scores[p.id] || 0) + roundScore
      return { playerId: p.id, playerName: p.name, bid, tricks, hit, roundScore, totalScore: this.scores[p.id] }
    })

    this.lastRoundSummary = summary

    // Advance dealer for next round
    this.dealerIdx = (this.dealerIdx + 1) % this.players.length

    if (this.round >= this.maxRound) {
      return { roundComplete: true, roundSummary: summary, gameComplete: true }
    }

    this.phase = 'round_end'
    return { roundComplete: true, roundSummary: summary, gameComplete: false }
  }

  nextRound() {
    if (this.phase !== 'round_end') throw new Error('Not in round_end phase')
    this._startRound()
  }

  endGame() {
    this.phase = 'game_over'
    const finalScores = [...this.players]
      .map(p => ({ playerId: p.id, playerName: p.name, score: this.scores[p.id] || 0 }))
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({ ...p, rank: i + 1 }))
    return { finalScores, winner: finalScores[0] }
  }

  // ── State ──────────────────────────────────────────────────────

  getPublicState() {
    return {
      roomId:           this.roomId,
      phase:            this.phase,
      round:            this.round,
      maxRound:         this.maxRound,
      handSize:         this.handSize,
      dealerName:       this.players[this.dealerIdx]?.name ?? null,
      trump:            this.trump,
      currentPlayerId:  this.phase === 'playing'  ? this.players[this.currentPlayerIdx]?.id : null,
      currentBidderId:  this.phase === 'bidding'  ? this.players[this.bidderIdx]?.id : null,
      forbiddenBid:     this.phase === 'bidding'  ? this.getForbiddenBid() : null,
      currentTrick:     this.currentTrick,
      players: this.players.map(p => ({
        id:        p.id,
        name:      p.name,
        score:     this.scores[p.id]   || 0,
        bid:       this.bids[p.id]     ?? null,
        tricks:    this.trickWins[p.id] ?? 0,
        cardCount: this.hands[p.id]?.length ?? 0,
        connected: p.connected,
        isHost:    p.id === this.hostId,
        isDealer:  this.players[this.dealerIdx]?.id === p.id,
      })),
      hostId:     this.hostId,
      maxPlayers: this.maxPlayers,
    }
  }

  getPlayerHand(playerId) {
    return this.hands[playerId] || []
  }
}

module.exports = OhHellGame
