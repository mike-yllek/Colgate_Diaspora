export default function SectionHeading({ children, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: 'var(--gold)',
        textShadow: '0 0 30px rgba(200,168,75,0.4)',
        marginBottom: '0.5rem',
      }}>
        {children}
      </h2>
      {subtitle && (
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.8rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.6,
        }}>
          {subtitle}
        </p>
      )}
      <div style={{
        margin: '1rem auto 0',
        width: '80px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
      }} />
    </div>
  )
}
