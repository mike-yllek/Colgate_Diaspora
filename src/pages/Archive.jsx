import SectionHeading from '../components/ui/SectionHeading'
import seasons from '../data/seasons'

export default function Archive() {
  const sorted = [...seasons].reverse()

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
      <SectionHeading subtitle="Season History">The Archive</SectionHeading>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sorted.map(season => (
          <div key={season.year} style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 1fr 1fr 100px',
            gap: '1rem',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            border: '1px solid rgba(200,168,75,0.15)',
            borderRadius: 'var(--card-radius)',
            background: 'rgba(107,26,42,0.08)',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(200,168,75,0.15)'}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--gold)',
            }}>
              {season.year}
            </span>
            <div>
              <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.5, marginBottom: '2px' }}>Champion</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>{season.champion}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.5, marginBottom: '2px' }}>Runner-Up</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>{season.runnerUp}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.5, marginBottom: '2px' }}>Last Place</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>{season.lastPlace}</p>
            </div>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              color: 'var(--gold)',
              opacity: 0.5,
              textAlign: 'right',
            }}>
              {season.platform}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
