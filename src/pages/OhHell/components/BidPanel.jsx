import { useState } from 'react'

/**
 * BidPanel — lets a player enter their bid for the round.
 *
 * Props:
 *   round       — current round number (= number of cards dealt)
 *   playerCount — number of players
 *   onBid       — callback with the chosen bid number
 *   forbidden   — optional bid value that's not allowed (last bidder rule)
 */
export default function BidPanel({ round, playerCount, onBid, forbidden }) {
  const [bid, setBid] = useState(null)

  const options = Array.from({ length: round + 1 }, (_, i) => i)

  const submit = () => {
    if (bid !== null) onBid?.(bid)
  }

  return (
    <div style={{
      border: '1px solid rgba(200,168,75,0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      background: 'rgba(13,5,8,0.7)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%',
    }}>
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.7rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        opacity: 0.7,
        marginBottom: '1rem',
      }}>
        How many tricks will you take?
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        marginBottom: '1.25rem',
      }}>
        {options.map(n => {
          const isForbidden = n === forbidden
          const isSelected = bid === n
          return (
            <button
              key={n}
              onClick={() => !isForbidden && setBid(n)}
              disabled={isForbidden}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                border: isSelected
                  ? '2px solid var(--gold-bright)'
                  : '1px solid rgba(200,168,75,0.3)',
                background: isSelected
                  ? 'rgba(200,168,75,0.25)'
                  : isForbidden
                  ? 'rgba(60,60,60,0.3)'
                  : 'rgba(107,26,42,0.2)',
                color: isForbidden
                  ? '#444'
                  : isSelected
                  ? 'var(--gold-bright)'
                  : 'var(--cream)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isForbidden ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                textDecoration: isForbidden ? 'line-through' : 'none',
              }}
            >
              {n}
            </button>
          )
        })}
      </div>

      <button
        onClick={submit}
        disabled={bid === null}
        style={{
          padding: '0.75rem 2.5rem',
          borderRadius: '8px',
          border: '1px solid var(--gold)',
          background: bid !== null ? 'rgba(200,168,75,0.2)' : 'rgba(60,60,60,0.2)',
          color: bid !== null ? 'var(--gold)' : '#555',
          fontFamily: 'var(--font-serif)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: bid !== null ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { if (bid !== null) e.currentTarget.style.background = 'rgba(200,168,75,0.35)' }}
        onMouseLeave={e => { if (bid !== null) e.currentTarget.style.background = 'rgba(200,168,75,0.2)' }}
      >
        Confirm Bid{bid !== null ? `: ${bid}` : ''}
      </button>
    </div>
  )
}
