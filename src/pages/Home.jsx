import SectionHeading from '../components/ui/SectionHeading'
import PokeCard from '../components/cards/PokeCard'
import members from '../data/members'
import seasons from '../data/seasons'

export default function Home() {
  const latestSeason = seasons[seasons.length - 1]
  const champion = members.find(m => m.name === latestSeason.champion)
  const activeFeatured = members.filter(m => m.active).slice(0, 3)

  return (
    <div className="maroon-glow-bg" style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: 'clamp(4rem, 10vw, 8rem) 2rem 4rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(107,26,42,0.5) 0%, transparent 65%)',
      }}>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.75rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.7,
          marginBottom: '1rem',
        }}>
          Est. 2013 · Sleeper League
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          color: 'var(--gold)',
          textShadow: '0 0 40px rgba(200,168,75,0.5), 0 0 80px rgba(200,168,75,0.2)',
          lineHeight: 1.2,
          marginBottom: '1.5rem',
        }}>
          Colgate Diaspora
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          color: 'var(--cream)',
          opacity: 0.7,
          maxWidth: '480px',
          margin: '0 auto 2.5rem',
        }}>
          A fantasy football league for Colgate University alumni and their degenerate associates. Est. 2013.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/archive" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '0.75rem 2rem',
            border: '1px solid var(--gold)',
            borderRadius: '6px',
            color: 'var(--gold)',
            background: 'rgba(200,168,75,0.08)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,168,75,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,168,75,0.08)' }}
          >
            View Archive
          </a>
          <a href="/bios" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '0.75rem 2rem',
            border: '1px solid rgba(200,168,75,0.3)',
            borderRadius: '6px',
            color: 'var(--cream)',
            opacity: 0.8,
            transition: 'all 0.2s ease',
          }}>
            Meet the Managers
          </a>
        </div>
      </section>

      {/* Season Snapshot */}
      <section style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <SectionHeading subtitle="Most Recent Season">{latestSeason.year} Season</SectionHeading>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {[
            { label: 'Champion',    value: latestSeason.champion   },
            { label: 'Runner-Up',   value: latestSeason.runnerUp   },
            { label: 'Last Place',  value: latestSeason.lastPlace  },
            { label: 'Platform',    value: latestSeason.platform   },
          ].map(({ label, value }) => (
            <div key={label} style={{
              border: '1px solid rgba(200,168,75,0.2)',
              borderRadius: 'var(--card-radius)',
              padding: '1.25rem',
              textAlign: 'center',
              background: 'rgba(107,26,42,0.1)',
            }}>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                opacity: 0.6,
                marginBottom: '0.4rem',
              }}>
                {label}
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: 'var(--gold-light)',
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cards */}
      <section style={{ padding: '2rem 2rem 6rem', maxWidth: '900px', margin: '0 auto' }}>
        <SectionHeading subtitle="Active Managers">The Managers</SectionHeading>
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {activeFeatured.map(m => (
            <PokeCard key={m.id} member={m} />
          ))}
        </div>
      </section>
    </div>
  )
}
