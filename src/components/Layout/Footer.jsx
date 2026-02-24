export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(200, 168, 75, 0.1)',
      padding: '32px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        color: 'var(--gold)',
        opacity: 0.45,
        letterSpacing: '0.04em',
        marginBottom: '6px',
      }}>
        Colgate Diaspora
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        color: 'var(--cream)',
        opacity: 0.25,
        letterSpacing: '0.1em',
      }}>
        Est. 2013 · Colgate University · Always on Sleeper
      </div>
    </footer>
  )
}
