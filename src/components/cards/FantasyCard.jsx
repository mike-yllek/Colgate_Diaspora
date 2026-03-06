import { useState } from 'react'

const TYPE_CONFIG = {
  fire:      { color: '#f97316', headerGrad: 'linear-gradient(135deg, #7c2d12, #c2410c)' },
  psychic:   { color: '#e879f9', headerGrad: 'linear-gradient(135deg, #4a044e, #86198f)' },
  water:     { color: '#38bdf8', headerGrad: 'linear-gradient(135deg, #075985, #0369a1)' },
  colorless: { color: '#d4c5a9', headerGrad: 'linear-gradient(135deg, #44403c, #6b7280)' },
  ice:       { color: '#67e8f9', headerGrad: 'linear-gradient(135deg, #164e63, #0e7490)' },
  fighting:  { color: '#f43f5e', headerGrad: 'linear-gradient(135deg, #881337, #be123c)' },
  grass:     { color: '#4ade80', headerGrad: 'linear-gradient(135deg, #14532d, #15803d)' },
  fainted:   { color: '#555555', headerGrad: 'linear-gradient(135deg, #1c1917, #292524)' },
}

const TYPE_ICONS = {
  fire: '🔥', psychic: '🔮', water: '💧', colorless: '⭐',
  ice: '❄', fighting: '👊', grass: '🌿', fainted: '💀',
}

// Card inner dimensions (border/padding adds ~6px around these)
const W = 294
const H = 430

export default function FantasyCard({ card }) {
  const [flipped, setFlipped] = useState(false)
  const tc       = TYPE_CONFIG[card.type] ?? TYPE_CONFIG.colorless
  const isFainted = card.type === 'fainted'

  const cardFront = (
    <div style={{
      position: 'absolute',
      inset: 0,
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
      borderRadius: '11px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      filter: isFainted ? 'grayscale(0.8)' : 'none',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: tc.headerGrad,
        padding: '0 8px',
        height: '36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        borderBottom: `1px solid ${tc.color}55`,
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: '#fff',
          textShadow: `0 0 8px ${tc.color}`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '175px',
        }}>
          {card.pokeName}
        </span>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.62rem',
          color: '#fff',
          opacity: 0.95,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          marginLeft: '6px',
        }}>
          HP {card.hp} {TYPE_ICONS[card.type]}
        </span>
      </div>

      {/* ── Art ── */}
      <div style={{
        height: '180px',
        flexShrink: 0,
        overflow: 'hidden',
        margin: '4px 5px',
        borderRadius: '5px',
        border: `1px solid ${tc.color}44`,
        position: 'relative',
      }}>
        <img
          src={card.image}
          alt={card.pokeName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      {/* ── Ability + Attacks ── */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 5px',
        gap: '3px',
      }}>
        {card.ability && (
          <div style={{
            padding: '4px 6px',
            background: 'rgba(0,0,0,0.45)',
            borderRadius: '4px',
            borderLeft: `3px solid ${tc.color}`,
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '4px' }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.55rem',
                letterSpacing: '0.08em',
                color: tc.color,
                textTransform: 'uppercase',
              }}>
                ✦ {card.ability.name}
              </span>
              {card.ability.cost && (
                <span style={{ fontSize: '0.68rem', flexShrink: 0 }}>{card.ability.cost}</span>
              )}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.3,
              marginTop: '2px',
            }}>
              {card.ability.desc}
            </div>
          </div>
        )}

        {card.attacks.map((atk, i) => (
          <div key={i} style={{
            padding: '4px 6px',
            background: 'rgba(0,0,0,0.28)',
            borderRadius: '4px',
            borderLeft: `3px solid ${tc.color}55`,
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                <span style={{ fontSize: '0.75rem', flexShrink: 0, letterSpacing: '1px' }}>{atk.cost}</span>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.06em',
                  color: '#fff',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {atk.name}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: tc.color,
                flexShrink: 0,
                marginLeft: '6px',
              }}>
                {atk.damage || '—'}
              </span>
            </div>
            {atk.desc && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.57rem',
                color: 'rgba(255,255,255,0.62)',
                lineHeight: 1.25,
                marginTop: '2px',
              }}>
                {atk.desc}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Flavor text ── */}
      {card.flavorText && (
        <div style={{ padding: '3px 7px 2px', flexShrink: 0 }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.55rem',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.48)',
            lineHeight: 1.3,
            margin: 0,
          }}>
            {card.flavorText}
          </p>
        </div>
      )}

      {/* ── Weakness / Resistance / Retreat ── */}
      <div style={{
        borderTop: `1px solid ${tc.color}33`,
        padding: '4px 7px',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '4px',
      }}>
        {[
          { label: 'Weakness',   value: card.weakness,   color: '#f87171' },
          { label: 'Resistance', value: card.resistance,  color: '#60a5fa' },
          { label: 'Retreat',    value: card.retreatCost > 0 ? '🏆'.repeat(card.retreatCost) : '—', color: '#fbbf24' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.42rem',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.38)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              color,
              whiteSpace: 'nowrap',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '2px 7px 5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.45rem',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.28)',
        }}>
          LVL {card.level}  {card.setNumber}
        </span>
        <span style={{ fontSize: '0.52rem', color: tc.color }}>
          {'★'.repeat(card.rarity)}{'☆'.repeat(3 - card.rarity)}
        </span>
      </div>

      {/* ── FAINTED stamp ── */}
      {isFainted && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            transform: 'rotate(-25deg)',
            border: '3px solid rgba(239,68,68,0.7)',
            borderRadius: '4px',
            padding: '4px 14px',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.2rem',
            letterSpacing: '0.2em',
            color: 'rgba(239,68,68,0.7)',
            textTransform: 'uppercase',
            fontWeight: 700,
            boxShadow: '0 0 16px rgba(239,68,68,0.3)',
          }}>
            FAINTED
          </div>
        </div>
      )}
    </div>
  )

  const cardBack = (
    <div style={{
      position: 'absolute',
      inset: 0,
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      borderRadius: '11px',
      overflow: 'hidden',
    }}>
      <img
        src="/images/poke/card_back.png"
        alt="Card back"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )

  const flipInner = (
    <div style={{
      position: 'relative',
      width: `${W}px`,
      height: `${H}px`,
      transformStyle: 'preserve-3d',
      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    }}>
      {cardBack}
      {cardFront}
    </div>
  )

  if (card.legendary) {
    return (
      <div
        className="poke-legendary-border"
        onClick={() => setFlipped(f => !f)}
        style={{
          cursor: 'pointer',
          filter: `drop-shadow(0 0 16px ${tc.color}99)`,
          display: 'inline-block',
        }}
      >
        <div style={{ perspective: '1000px' }}>
          {flipInner}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{
        cursor: 'pointer',
        border: `3px solid ${tc.color}66`,
        borderRadius: '14px',
        display: 'inline-block',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${tc.color}22`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 14px 44px rgba(0,0,0,0.5), 0 0 20px ${tc.color}44`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${tc.color}22`
      }}
    >
      <div style={{ perspective: '1000px' }}>
        {flipInner}
      </div>
    </div>
  )
}
