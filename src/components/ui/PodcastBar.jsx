export default function PodcastBar({ episode }) {
  const { title, date, duration, description, audioUrl } = episode

  return (
    <div style={{
      border: '1px solid rgba(200,168,75,0.2)',
      borderRadius: 'var(--card-radius)',
      padding: '1.5rem',
      background: 'rgba(13,5,8,0.6)',
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center',
      transition: 'border-color 0.2s ease',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,168,75,0.5)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(200,168,75,0.2)'}
    >
      {/* Play Button */}
      <button style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--maroon), var(--maroon-light))',
        border: '2px solid var(--gold)',
        color: 'var(--gold)',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        ▶
      </button>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1rem',
          color: 'var(--gold-light)',
          marginBottom: '0.25rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {title}
        </h3>
        {description && (
          <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.25rem' }}>{description}</p>
        )}
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          color: 'var(--gold)',
          opacity: 0.5,
        }}>
          {date} · {duration}
        </span>
      </div>
    </div>
  )
}
