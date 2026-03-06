import { useState } from 'react'

const TYPE_CONFIG = {
  fire:     { color: '#f97316', headerGrad: 'linear-gradient(135deg, #7c2d12, #c2410c)' },
  psychic:  { color: '#e879f9', headerGrad: 'linear-gradient(135deg, #4a044e, #86198f)' },
  water:    { color: '#38bdf8', headerGrad: 'linear-gradient(135deg, #075985, #0369a1)' },
  electric: { color: '#fbbf24', headerGrad: 'linear-gradient(135deg, #78350f, #b45309)' },
  fighting: { color: '#f43f5e', headerGrad: 'linear-gradient(135deg, #881337, #be123c)' },
  ice:      { color: '#67e8f9', headerGrad: 'linear-gradient(135deg, #164e63, #0e7490)' },
  normal:   { color: '#a8a878', headerGrad: 'linear-gradient(135deg, #44403c, #57534e)' },
  fainted:  { color: '#555555', headerGrad: 'linear-gradient(135deg, #1c1917, #292524)' },
}

const TYPE_ICONS = {
  fire: '🔥', psychic: '🔮', water: '💧', electric: '⚡',
  fighting: '👊', ice: '❄', normal: '⭐', fainted: '💀',
}

export default function FantasyCard({ card }) {
  const [flipped, setFlipped] = useState(false)
  const tc = TYPE_CONFIG[card.type] ?? TYPE_CONFIG.normal
  const isFainted = card.type === 'fainted'
  const stars = Array.from({ length: card.rarity }, (_, i) => i)

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

      {/* Header */}
      <div style={{
        background: tc.headerGrad,
        padding: '5px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        borderBottom: `1px solid ${tc.color}55`,
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.62rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: '#fff',
          textShadow: `0 0 8px ${tc.color}`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '130px',
        }}>
          {card.pokeName}
        </span>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.58rem',
          letterSpacing: '0.04em',
          color: '#fff',
          opacity: 0.9,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          HP {card.hp} {TYPE_ICONS[card.type]}
        </span>
      </div>

      {/* Art image */}
      <div style={{
        height: '185px',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        margin: '4px',
        borderRadius: '6px',
        border: `1px solid ${tc.color}44`,
      }}>
        <img
          src={card.image}
          alt={card.pokeName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      {/* Ability */}
      <div style={{
        margin: '0 6px 3px',
        padding: '4px 6px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '4px',
        borderLeft: `2px solid ${tc.color}`,
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.52rem',
          letterSpacing: '0.1em',
          color: tc.color,
          textTransform: 'uppercase',
          marginBottom: '1px',
        }}>
          ✦ {card.ability.name}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.58rem',
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.25,
        }}>
          {card.ability.desc}
        </div>
      </div>

      {/* Attacks */}
      {card.attacks.map((atk, i) => (
        <div key={i} style={{
          margin: `0 6px ${i < card.attacks.length - 1 ? '3px' : '3px'}`,
          padding: '4px 6px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '4px',
          borderLeft: `2px solid ${tc.color}66`,
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1px',
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.52rem',
              letterSpacing: '0.08em',
              color: '#fff',
              textTransform: 'uppercase',
            }}>
              ⚔ {atk.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: tc.color,
              flexShrink: 0,
            }}>
              {atk.damage > 0 ? atk.damage : '—'}
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.55rem',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.2,
          }}>
            {atk.desc}
          </div>
        </div>
      ))}

      {/* Divider + Flavor text + Footer */}
      <div style={{
        marginTop: 'auto',
        borderTop: `1px solid ${tc.color}33`,
        padding: '4px 6px 5px',
        flexShrink: 0,
      }}>
        {card.flavorText && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.55rem',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.3,
            marginBottom: '3px',
          }}>
            {card.flavorText}
          </p>
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.48rem',
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.35)',
          }}>
            LVL {card.level}  {card.setNumber}
          </span>
          <span style={{
            fontSize: '0.55rem',
            color: tc.color,
            letterSpacing: '1px',
          }}>
            {'★'.repeat(card.rarity)}{'☆'.repeat(3 - card.rarity)}
          </span>
        </div>
      </div>

      {/* FAINTED stamp overlay */}
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
            border: '3px solid rgba(239, 68, 68, 0.7)',
            borderRadius: '4px',
            padding: '4px 12px',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.1rem',
            letterSpacing: '0.2em',
            color: 'rgba(239, 68, 68, 0.7)',
            textTransform: 'uppercase',
            fontWeight: 700,
            boxShadow: '0 0 12px rgba(239, 68, 68, 0.3)',
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

  const innerCard = (
    <div
      style={{
        position: 'relative',
        width: '234px',
        height: '330px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}
    >
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
          filter: `drop-shadow(0 0 14px ${tc.color}88)`,
          display: 'inline-block',
        }}
      >
        <div style={{ perspective: '1000px' }}>
          {innerCard}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{
        cursor: 'pointer',
        border: `2px solid ${tc.color}66`,
        borderRadius: '13px',
        padding: '1px',
        display: 'inline-block',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${tc.color}22`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 16px ${tc.color}44`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${tc.color}22`
      }}
    >
      <div style={{ perspective: '1000px' }}>
        {innerCard}
      </div>
    </div>
  )
}
