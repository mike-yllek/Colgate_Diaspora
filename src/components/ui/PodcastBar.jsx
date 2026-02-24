import { useState } from 'react'

const WAVE_DELAYS = ['0s', '0.12s', '0.05s', '0.18s', '0.08s']

function Waveform({ playing }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '22px', flexShrink: 0 }}>
      {WAVE_DELAYS.map((delay, i) => (
        <div key={i} style={{
          width: '3px',
          height: '100%',
          background: 'var(--gold)',
          borderRadius: '2px 2px 1px 1px',
          opacity: 0.6,
          transformOrigin: 'bottom',
          transform: playing ? undefined : 'scaleY(0.2)',
          animation: playing ? `waveform 0.65s ease-in-out ${delay} infinite` : 'none',
          transition: 'transform 0.3s ease',
        }} />
      ))}
    </div>
  )
}

export default function PodcastBar({ episode, featured = false }) {
  const { title, date, duration, description } = episode
  const [playing, setPlaying] = useState(false)

  const PlayBtn = ({ size = 44, playing, onToggle }) => (
    <button
      onClick={onToggle}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: playing
          ? 'var(--gold)'
          : 'linear-gradient(135deg, var(--maroon), var(--maroon-light))',
        border: `2px solid ${playing ? 'var(--gold)' : 'rgba(200,168,75,0.5)'}`,
        color: playing ? 'var(--dark)' : 'var(--gold)',
        fontSize: `${size * 0.36}px`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s ease',
        lineHeight: 1,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {playing ? '⏸' : '▶'}
    </button>
  )

  /* ── Featured mode: full-width strip used on Homepage ─────────── */
  if (featured) {
    return (
      <div style={{
        background: 'rgba(10,4,7,0.92)',
        borderTop: '1px solid rgba(200,168,75,0.12)',
        borderBottom: '1px solid rgba(200,168,75,0.12)',
        padding: '1.1rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        {/* Label */}
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.55,
          whiteSpace: 'nowrap',
        }}>
          🎙 Latest Episode
        </span>

        <Waveform playing={playing} />

        {/* Title + duration */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.88rem',
            color: 'var(--gold-light)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.68rem',
            color: 'var(--cream)',
            opacity: 0.38,
            marginTop: '2px',
          }}>
            {duration}
          </div>
        </div>

        <PlayBtn size={40} playing={playing} onToggle={() => setPlaying(p => !p)} />
      </div>
    )
  }

  /* ── Default mode: list item used on Podcasts page ─────────────── */
  return (
    <div
      style={{
        border: '1px solid rgba(200,168,75,0.2)',
        borderRadius: 'var(--card-radius)',
        padding: '1.25rem 1.5rem',
        background: 'rgba(13,5,8,0.6)',
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'center',
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,75,0.5)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,168,75,0.2)' }}
    >
      <PlayBtn size={44} playing={playing} onToggle={() => setPlaying(p => !p)} />

      <Waveform playing={playing} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.95rem',
          color: 'var(--gold-light)',
          marginBottom: '0.2rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {title}
        </h3>
        {description && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            color: 'var(--cream)',
            opacity: 0.55,
            marginBottom: '0.2rem',
          }}>
            {description}
          </p>
        )}
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          color: 'var(--gold)',
          opacity: 0.45,
        }}>
          {[date, duration].filter(Boolean).join(' · ')}
        </span>
      </div>
    </div>
  )
}
