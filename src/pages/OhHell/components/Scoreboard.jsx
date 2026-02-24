/**
 * Scoreboard — sidebar showing all players, their bids, tricks taken, and scores.
 */
export default function Scoreboard({ players = [], round }) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <div>
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.7rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        opacity: 0.6,
        marginBottom: '1.25rem',
      }}>
        Scores
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sorted.map((player, i) => (
          <div key={player.name} style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: `1px solid ${i === 0 ? 'rgba(200,168,75,0.4)' : 'rgba(200,168,75,0.1)'}`,
            background: i === 0 ? 'rgba(200,168,75,0.08)' : 'rgba(107,26,42,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                color: i === 0 ? 'var(--gold)' : 'var(--cream)',
              }}>
                {i === 0 && '★ '}{player.name}
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                color: i === 0 ? 'var(--gold-bright)' : 'var(--cream)',
              }}>
                {player.score}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '0.1em',
                color: 'var(--gold)',
                opacity: 0.5,
              }}>
                Bid: {player.bid ?? '—'}
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '0.1em',
                color: 'var(--cream)',
                opacity: 0.4,
              }}>
                Tricks: {player.tricks ?? 0}
              </span>
            </div>
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <p style={{ color: 'var(--cream)', opacity: 0.3, fontSize: '0.8rem' }}>
          No players yet
        </p>
      )}
    </div>
  )
}
