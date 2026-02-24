/**
 * CardBack — decorative back of a playing card (used in Oh Hell!)
 * Features the Colgate Diaspora pitchfork (⚡) on a maroon background.
 */
export default function CardBack({ size = 'md' }) {
  const dimensions = {
    sm: { width: 60,  height: 84  },
    md: { width: 80,  height: 112 },
    lg: { width: 100, height: 140 },
  }
  const { width, height } = dimensions[size] || dimensions.md

  return (
    <div style={{
      width,
      height,
      borderRadius: '6px',
      border: '2px solid var(--gold)',
      background: 'linear-gradient(155deg, var(--maroon-dark) 0%, var(--maroon) 55%, var(--maroon-dark) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.7), inset 0 0 20px rgba(107,26,42,0.4)',
      flexShrink: 0,
    }}>
      {/* Inner gold frame */}
      <div style={{
        position: 'absolute',
        inset: '5px',
        border: '1px solid rgba(200,168,75,0.3)',
        borderRadius: '3px',
        pointerEvents: 'none',
      }} />
      {/* Diagonal hatching */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent ${Math.round(width * 0.09)}px,
            rgba(200,168,75,0.045) ${Math.round(width * 0.09)}px,
            rgba(200,168,75,0.045) ${Math.round(width * 0.1)}px
          )
        `,
        pointerEvents: 'none',
      }} />
      {/* Center pitchfork emblem */}
      <span style={{
        fontSize: `${Math.round(width * 0.42)}px`,
        color: 'var(--gold)',
        opacity: 0.88,
        zIndex: 1,
        filter: 'drop-shadow(0 0 8px rgba(200,168,75,0.65))',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        ⚡
      </span>
    </div>
  )
}
