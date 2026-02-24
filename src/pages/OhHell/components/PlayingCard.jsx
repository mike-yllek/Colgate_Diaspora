import { motion } from 'framer-motion'
import CardBack from '../../../components/cards/CardBack'

const SUIT_COLORS = {
  '♠': '#1a1a2e',
  '♣': '#1a1a2e',
  '♥': '#cc2222',
  '♦': '#cc3311',
}

/**
 * PlayingCard — a standard playing card face.
 *
 * Props:
 *   card      — { suit, rank }
 *   faceDown  — render card back instead
 *   selected  — highlight with gold glow
 *   onClick   — click handler (enables hover lift when provided)
 *   style     — additional inline styles
 */
export default function PlayingCard({ card, faceDown = false, selected = false, onClick, style = {} }) {
  if (faceDown) return <CardBack size="md" />

  const { suit, rank } = card
  const color = SUIT_COLORS[suit] || '#1a1a1a'

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { y: -10, boxShadow: '0 14px 32px rgba(0,0,0,0.65)' } : {}}
      whileTap={onClick ? { scale: 0.96 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{
        width: '64px',
        height: '90px',
        borderRadius: '6px',
        border: selected ? '2px solid var(--gold-bright)' : '1px solid rgba(0,0,0,0.14)',
        background: 'linear-gradient(155deg, #faf8f4 0%, #ede5d4 100%)',
        boxShadow: selected
          ? '0 8px 24px rgba(200,168,75,0.5)'
          : '0 4px 14px rgba(0,0,0,0.55)',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4px 6px',
        userSelect: 'none',
        position: 'relative',
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Top-left rank + suit */}
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        color,
        lineHeight: 1.15,
        fontFamily: 'var(--font-body)',
      }}>
        {rank}<br />{suit}
      </div>

      {/* Center suit */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        color,
        opacity: 0.65,
        pointerEvents: 'none',
      }}>
        {suit}
      </div>

      {/* Bottom-right rank + suit (rotated) */}
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        color,
        lineHeight: 1.15,
        fontFamily: 'var(--font-body)',
        transform: 'rotate(180deg)',
        alignSelf: 'flex-end',
      }}>
        {rank}<br />{suit}
      </div>
    </motion.div>
  )
}
