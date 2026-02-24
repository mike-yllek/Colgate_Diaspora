/**
 * CardBack — decorative back of a playing card (used in Oh Hell!)
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
      background: 'linear-gradient(135deg, var(--maroon-dark) 0%, var(--dark) 50%, var(--maroon-dark) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
    }}>
      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(200,168,75,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200,168,75,0.08) 1px, transparent 1px)
        `,
        backgroundSize: '12px 12px',
      }} />
      {/* Center emblem */}
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: `${width * 0.3}px`,
        color: 'var(--gold)',
        opacity: 0.7,
        zIndex: 1,
        textShadow: '0 0 10px rgba(200,168,75,0.5)',
      }}>
        CD
      </span>
    </div>
  )
}
