import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CardBack from '../../components/cards/CardBack'

export default function OhHellLobby() {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const navigate = useNavigate()

  const handleJoin = (e) => {
    e.preventDefault()
    if (!name.trim() || !room.trim()) return
    navigate(`/oh-hell/${room.trim().toLowerCase().replace(/\s+/g, '-')}`, {
      state: { playerName: name.trim() }
    })
  }

  const handleCreate = () => {
    const id = Math.random().toString(36).slice(2, 8)
    navigate(`/oh-hell/${id}`, { state: { playerName: name.trim() || 'Guest' } })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at 50% 40%, rgba(61,10,20,0.6) 0%, rgba(13,5,8,0.9) 70%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient floating cards */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          opacity: 0.06,
          transform: `rotate(${i * 30 + 15}deg) translate(${(i % 3 - 1) * 200}px, ${(i % 2 - 0.5) * 300}px)`,
          pointerEvents: 'none',
        }}>
          <CardBack size="lg" />
        </div>
      ))}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '0.5rem',
          filter: 'drop-shadow(0 0 20px rgba(200,168,75,0.8))',
        }}>
          ⚡
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: 'var(--gold)',
          textShadow: '0 0 40px rgba(200,168,75,0.6)',
          marginBottom: '0.5rem',
        }}>
          Oh Hell!
        </h1>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.6,
        }}>
          The Colgate Diaspora Card Room
        </p>
        <p style={{
          marginTop: '0.75rem',
          color: 'var(--cream)',
          opacity: 0.5,
          fontSize: '0.9rem',
          maxWidth: '360px',
        }}>
          A trick-taking card game. Bid exactly right, or suffer the consequences.
        </p>
      </div>

      {/* Lobby Form */}
      <div style={{
        border: '1px solid rgba(200,168,75,0.3)',
        borderRadius: '16px',
        padding: '2rem',
        background: 'rgba(13,5,8,0.8)',
        backdropFilter: 'blur(12px)',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1,
      }}>
        <form onSubmit={handleJoin}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.7,
            marginBottom: '0.5rem',
          }}>
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Ollie"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(200,168,75,0.3)',
              background: 'rgba(107,26,42,0.15)',
              color: 'var(--cream)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              marginBottom: '1.25rem',
              outline: 'none',
            }}
          />

          <label style={{
            display: 'block',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.7,
            marginBottom: '0.5rem',
          }}>
            Room Code
          </label>
          <input
            type="text"
            value={room}
            onChange={e => setRoom(e.target.value)}
            placeholder="e.g. maroon42"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(200,168,75,0.3)',
              background: 'rgba(107,26,42,0.15)',
              color: 'var(--cream)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              marginBottom: '1.5rem',
              outline: 'none',
            }}
          />

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--gold)',
                background: 'rgba(200,168,75,0.15)',
                color: 'var(--gold)',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,168,75,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,168,75,0.15)'}
            >
              Join Room
            </button>
            <button
              type="button"
              onClick={handleCreate}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(200,168,75,0.3)',
                background: 'rgba(107,26,42,0.2)',
                color: 'var(--cream)',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                opacity: 0.8,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
            >
              New Game
            </button>
          </div>
        </form>
      </div>

      {/* Rules snippet */}
      <div style={{
        marginTop: '2rem',
        maxWidth: '400px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--cream)',
          opacity: 0.35,
          lineHeight: 1.6,
        }}>
          3–7 players · Bid the exact number of tricks you'll take · Score points only if you hit your bid exactly
        </p>
      </div>
    </div>
  )
}
