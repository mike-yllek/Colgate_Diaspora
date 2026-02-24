import SectionHeading from '../components/ui/SectionHeading'
import PokeCard from '../components/cards/PokeCard'
import members from '../data/members'

function memberStats(m) {
  const classShort = m.class.replace('Colgate ', '').replace('League ', '')
  return [
    { label: 'Class',    value: classShort },
    { label: 'Seasons',  value: '12+' },
    { label: 'Status',   value: m.active ? 'Active' : 'Alumni' },
  ]
}

export default function Bios() {
  const active = members.filter(m => m.active)
  const alumni = members.filter(m => m.alumni)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
          {active.map((m, i) => (
            <PokeCard
              key={m.id}
              variant="member"
              name={m.name}
              role={m.role}
              photo={m.photo}
              flavorText={m.flavorText}
              stats={memberStats(m)}
              cardNumber={String(i + 1).padStart(3, '0')}
              season="2024"
            />
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
            {alumni.map((m, i) => (
              <PokeCard
                key={m.id}
                variant="alumni"
                name={m.name}
                role={m.role}
                photo={m.photo}
                flavorText={m.flavorText}
                stats={memberStats(m)}
                cardNumber={String(active.length + i + 1).padStart(3, '0')}
                season="2024"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
