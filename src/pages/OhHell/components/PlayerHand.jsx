import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SUIT_COLORS = {
  '♠': 'var(--cream)',
  '♣': 'var(--cream)',
  '♥': '#e05555',
  '♦': '#e05555',
}

/**
 * Renders the player's hand of cards.
 *
 * Props:
 *   cards    — array of { suit, rank } objects
 *   onPlay   — callback when a card is clicked
 */
export default function PlayerHand({ cards = [], onPlay }) {
  const [selected, setSelected] = useState(null)

  const handleClick = (card) => {
    if (selected?.rank === card.rank && selected?.suit === card.suit) {
      onPlay?.(card)
      setSelected(null)
    } else {
      setSelected(card)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '-8px',
      position: 'relative',
      height: '120px',
      alignItems: 'flex-end',
    }}>
      <AnimatePresence>
        {cards.map((card, i) => {
          const isSelected = selected?.rank === card.rank && selected?.suit === card.suit
          const angle = (i - (cards.length - 1) / 2) * 4
          const suitColor = SUIT_COLORS[card.suit] || 'var(--cream)'

          return (
            <motion.div
              key={`${card.rank}${card.suit}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: isSelected ? -20 : 0,
                rotate: angle,
                zIndex: isSelected ? 50 : i,
              }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => handleClick(card)}
              style={{
                width: '64px',
                height: '90px',
                borderRadius: '6px',
                border: isSelected ? '2px solid var(--gold-bright)' : '1px solid rgba(200,168,75,0.3)',
                background: 'linear-gradient(160deg, #f5f0e8 0%, #e8e0cc 100%)',
                boxShadow: isSelected
                  ? '0 8px 24px rgba(200,168,75,0.5)'
                  : '0 4px 12px rgba(0,0,0,0.5)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4px 6px',
                marginLeft: i > 0 ? '-16px' : '0',
                transformOrigin: 'bottom center',
              }}
            >
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: suitColor,
                lineHeight: 1,
              }}>
                {card.rank}
                <br />
                {card.suit}
              </span>
              <span style={{
                fontSize: '1.1rem',
                textAlign: 'center',
                color: suitColor,
                alignSelf: 'center',
              }}>
                {card.suit}
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: suitColor,
                lineHeight: 1,
                transform: 'rotate(180deg)',
                alignSelf: 'flex-end',
              }}>
                {card.rank}
                <br />
                {card.suit}
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {cards.length === 0 && (
        <p style={{ color: 'var(--cream)', opacity: 0.3, fontFamily: 'var(--font-serif)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          No cards yet
        </p>
      )}
    </div>
  )
}
