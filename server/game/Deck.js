const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']

class Deck {
  constructor() {
    this.cards = []
    this.reset()
  }

  reset() {
    this.cards = []
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        this.cards.push({ suit, rank })
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
    return this
  }

  deal(count) {
    return this.cards.splice(0, count)
  }

  flip() {
    return this.cards[0] || null
  }

  rankValue(rank) {
    return RANKS.indexOf(rank)
  }

  /** Returns -1, 0, or 1 comparing two cards given a lead suit and trump suit */
  compare(a, b, leadSuit, trumpSuit) {
    const aIsTrump = a.suit === trumpSuit
    const bIsTrump = b.suit === trumpSuit
    const aIsLead  = a.suit === leadSuit
    const bIsLead  = b.suit === leadSuit

    if (aIsTrump && !bIsTrump) return 1
    if (!aIsTrump && bIsTrump) return -1
    if (aIsLead  && !bIsLead  && !bIsTrump) return 1
    if (!aIsLead && bIsLead   && !aIsTrump) return -1

    if (a.suit === b.suit) {
      return this.rankValue(a.rank) - this.rankValue(b.rank)
    }
    return 0
  }
}

module.exports = Deck
