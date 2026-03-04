/**
 * Scoreboard — sidebar showing all players, their bids, tricks taken, and scores.
 */
export default function Scoreboard({ players = [], round, myPlayerId }) {
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
        {sorted.map((player, i) => {
          const isMe      = player.id === myPlayerId
          const isLeading = i === 0
          return (
            <div key={player.id} style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: isMe
                ? '1px solid rgba(200,168,75,0.7)'
                : `1px solid ${isLeading ? 'rgba(200,168,75,0.4)' : 'rgba(200,168,75,0.1)'}`,
              background: isMe
                ? 'rgba(200,168,75,0.13)'
                : isLeading ? 'rgba(200,168,75,0.08)' : 'rgba(107,26,42,0.05)',
              boxShadow: isMe ? '0 0 10px rgba(200,168,75,0.15)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                  {isLeading && <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>★</span>}
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    color: isMe ? 'var(--gold)' : isLeading ? 'var(--gold)' : 'var(--cream)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {player.name}
                  </span>
                  {isMe && (
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.48rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                      background: 'rgba(200,168,75,0.18)',
                      border: '1px solid rgba(200,168,75,0.4)',
                      borderRadius: '3px',
                      padding: '1px 5px',
                      flexShrink: 0,
                    }}>
                      You
                    </span>
                  )}
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  color: isMe ? 'var(--gold)' : isLeading ? 'var(--gold-bright)' : 'var(--cream)',
                  flexShrink: 0,
                  marginLeft: '0.5rem',
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
          )
        })}
      </div>

      {players.length === 0 && (
        <p style={{ color: 'var(--cream)', opacity: 0.3, fontSize: '0.8rem' }}>
          No players yet
        </p>
      )}
    </div>
  )
}
