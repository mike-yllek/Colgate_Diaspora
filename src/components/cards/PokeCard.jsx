import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * PokeCard — Pokémon-style member card
 *
 * Props:
 *   member   — member data object
 *   champion — boolean: renders holographic rainbow border + full color
 *   loser    — boolean: renders grayscale + muted border
 */
export default function PokeCard({ member, champion = false, loser = false }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -12, y: dx * 12 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  const borderStyle = champion
    ? '3px solid transparent'
    : loser
    ? '2px solid rgba(120,120,120,0.4)'
    : '2px solid rgba(200,168,75,0.4)'

  const backgroundStyle = champion
    ? 'conic-gradient(from var(--angle, 0deg), #ff006680, #ff7b0080, #ffe06680, #00ff9580, #00b4ff80, #8b5cf680, #ff006680) border-box'
    : undefined

  return (
    <motion.div
      ref={cardRef}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
        width: '200px',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Spinning border for champion */}
      {champion && (
        <div style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '14px',
          background: 'conic-gradient(from 0deg, #ff0066, #ff7b00, #ffe066, #00ff95, #00b4ff, #8b5cf6, #ff0066)',
          animation: 'spin 4s linear infinite',
          zIndex: 0,
        }} />
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '12px',
          border: champion ? 'none' : borderStyle,
          background: loser
            ? 'linear-gradient(160deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(160deg, rgba(61,10,20,0.9) 0%, rgba(13,5,8,0.95) 100%)',
          filter: loser ? 'grayscale(0.85) brightness(0.7)' : 'none',
          overflow: 'hidden',
          boxShadow: hovered
            ? champion
              ? '0 20px 60px rgba(200,168,75,0.5), 0 0 40px rgba(139,92,246,0.3)'
              : '0 20px 40px rgba(200,168,75,0.25)'
            : '0 4px 20px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Photo */}
        <div style={{
          height: '160px',
          background: `url(${member.photo}) center/cover no-repeat, linear-gradient(135deg, var(--maroon-dark), var(--dark))`,
          position: 'relative',
        }}>
          {/* Holographic sheen on hover */}
          {hovered && !loser && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: champion
                ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(139,92,246,0.15) 50%, rgba(200,168,75,0.1) 100%)'
                : 'linear-gradient(135deg, rgba(200,168,75,0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
          )}

          {/* Champion / Loser badge */}
          {(champion || loser) && (
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: '4px',
              background: champion ? 'rgba(200,168,75,0.9)' : 'rgba(80,80,80,0.8)',
              color: champion ? '#0D0508' : '#aaa',
              fontWeight: 700,
            }}>
              {champion ? '★ Champion' : 'L'}
            </span>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '0.75rem 1rem 1rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: loser ? '#888' : 'var(--gold)',
            marginBottom: '0.2rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {member.name}
          </h3>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: loser ? '#666' : 'var(--gold-light)',
            opacity: 0.8,
            marginBottom: '0.5rem',
          }}>
            {member.role}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-body)',
              color: loser ? '#555' : 'var(--cream)',
              opacity: 0.6,
            }}>
              {member.class}
            </span>
            {member.alumni && (
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '0.1em',
                color: '#666',
                textTransform: 'uppercase',
              }}>
                Alumni
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}
