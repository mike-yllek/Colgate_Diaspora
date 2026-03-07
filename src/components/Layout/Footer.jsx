import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Footer() {
  const [noteHovered, setNoteHovered] = useState(false)

  return (
    <footer style={{
      borderTop: '1px solid rgba(200, 168, 75, 0.1)',
      padding: '32px',
      textAlign: 'center',
      position: 'relative',
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

      <Link
        to="/note"
        onMouseEnter={() => setNoteHovered(true)}
        onMouseLeave={() => setNoteHovered(false)}
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '32px',
          fontFamily: 'var(--font-serif)',
          fontSize: '0.6rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--cream)',
          opacity: noteHovered ? 1 : 0.3,
          textDecoration: 'none',
          transition: 'opacity 0.2s ease',
        }}
      >
        Note
      </Link>
    </footer>
  )
}
