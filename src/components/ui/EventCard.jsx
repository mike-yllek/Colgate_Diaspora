export default function EventCard({ event }) {
  const { title, date, description, type } = event

  const typeColors = {
    draft:    'var(--maroon-light)',
    deadline: 'var(--gold)',
    playoff:  '#4a90d9',
    social:   '#4caf75',
  }

  return (
    <div style={{
      border: `1px solid rgba(200,168,75,0.2)`,
      borderRadius: 'var(--card-radius)',
      padding: '1.25rem',
      background: 'rgba(107,26,42,0.1)',
      transition: 'border-color 0.2s ease, transform 0.2s ease',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(200,168,75,0.6)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(200,168,75,0.2)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: typeColors[type] || 'var(--gold)',
          border: `1px solid ${typeColors[type] || 'var(--gold)'}`,
          borderRadius: '4px',
          padding: '2px 8px',
        }}>
          {type}
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--cream)',
          opacity: 0.6,
        }}>
          {date}
        </span>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1rem',
        color: 'var(--gold-light)',
        marginBottom: '0.25rem',
      }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>{description}</p>
      )}
    </div>
  )
}
