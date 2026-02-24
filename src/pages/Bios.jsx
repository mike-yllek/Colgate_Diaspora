import SectionHeading from '../components/ui/SectionHeading'
import PokeCard from '../components/cards/PokeCard'
import members from '../data/members'

export default function Bios() {
  const active = members.filter(m => m.active)
  const alumni = members.filter(m => m.alumni)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
      <SectionHeading subtitle="The Full Roster">League Members</SectionHeading>

      {/* Active managers */}
      <section style={{ marginBottom: '4rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.75rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.7,
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          Active Managers
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          justifyContent: 'center',
        }}>
          {active.map(m => (
            <PokeCard key={m.id} member={m} />
          ))}
        </div>
      </section>

      {/* Alumni */}
      {alumni.length > 0 && (
        <section>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.5,
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            Alumni
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
          }}>
            {alumni.map(m => (
              <PokeCard key={m.id} member={m} loser />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
