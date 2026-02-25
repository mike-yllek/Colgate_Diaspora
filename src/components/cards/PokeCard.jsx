import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const TYPE_LABELS = {
  champion: '⭐ League Champion',
  loser:    '☠ Last Place',
  member:   '⚡ Member',
  alumni:   'Alumni',
}

export default function PokeCard({
  variant     = 'member',
  name,
  role,
  photo,
  flavorText,
  stats       = [],
  record,
  cardNumber  = '001',
  season      = '2025',
  powerScore  = null,
  typeLabel   = null,
}) {
  const cardRef  = useRef(null)
  const [tilt, setTilt]       = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const isChampion  = variant === 'champion'
  const isLoser     = variant === 'loser'
  const isAlumni    = variant === 'alumni'
  const shouldFloat = isChampion || isLoser

  /* ── Tilt on mouse move ───────────────────────────────────────── */
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)
    setTilt({ x: dy * -10, y: dx * 10 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  /* ── Box shadow (hover glow) ──────────────────────────────────── */
  const boxShadow = hovered
    ? isChampion
      ? '0 24px 60px rgba(200,168,75,0.55), 0 0 40px rgba(139,92,246,0.35), 0 0 80px rgba(255,0,102,0.15)'
      : isLoser
      ? '0 16px 40px rgba(0,0,0,0.7), 0 0 20px rgba(60,60,60,0.4)'
      : '0 16px 40px rgba(200,168,75,0.3), 0 0 20px rgba(200,168,75,0.12)'
    : '0 6px 24px rgba(0,0,0,0.55)'

  /* ── Border wrapper: class (holo/loser) or static style ─────── */
  const wrapperClass = isChampion ? 'card-holo-border' : isLoser ? 'card-loser-border' : undefined
  const staticBorder = !wrapperClass
    ? { border: `2px solid ${isAlumni ? 'rgba(200,168,75,0.2)' : 'rgba(200,168,75,0.38)'}`, borderRadius: '13px' }
    : {}

  /* ── Inner card border-radius (3px less than wrapper) ─────────── */
  const innerRadius = (isChampion || isLoser) ? '12px' : '11px'

  /* ── Dim gold color for loser/alumni contexts ───────────────────*/
  const goldColor  = isLoser ? '#555' : isAlumni ? 'rgba(200,168,75,0.5)' : 'var(--gold)'
  const textColor  = isLoser ? '#666' : 'var(--cream)'

  return (
    /* Float wrapper — CSS animation keeps clear of Framer Motion's transform */
    <div style={{ display: 'inline-block', animation: shouldFloat ? 'float 3s ease-in-out infinite' : 'none' }}>

      {/* Tilt + hover-lift wrapper */}
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y, y: !shouldFloat && hovered ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: '800px', transformStyle: 'preserve-3d', cursor: 'pointer', width: '220px' }}
      >

        {/* Border wrapper */}
        <div
          ref={cardRef}
          className={wrapperClass}
          style={{ ...staticBorder, boxShadow, transition: 'box-shadow 0.3s ease' }}
        >

          {/* ── Inner card ───────────────────────────────────────── */}
          <div style={{
            background: isLoser
              ? 'linear-gradient(160deg, #111 0%, #1c1c1c 100%)'
              : 'linear-gradient(160deg, rgba(61,10,20,0.97) 0%, rgba(13,5,8,0.99) 100%)',
            borderRadius: innerRadius,
            overflow: 'hidden',
            filter: isAlumni ? 'brightness(0.78) saturate(0.55)' : 'none',
          }}>

            {/* 1 ── Header bar */}
            <div style={{
              background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
              borderBottom: `1px solid ${isLoser ? 'rgba(80,80,80,0.35)' : 'rgba(200,168,75,0.4)'}`,
              padding: '6px 10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '28px',
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.58rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isChampion ? 'var(--gold)' : isLoser ? '#777' : 'var(--gold-light)',
              }}>
                {typeLabel ?? TYPE_LABELS[variant]}
              </span>
              {record && (
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.04em',
                  color: isChampion ? 'var(--gold)' : '#777',
                }}>
                  {record}
                </span>
              )}
            </div>

            {/* 2 ── Name strip */}
            <div style={{
              padding: '8px 10px 6px',
              background: 'rgba(0,0,0,0.25)',
              borderBottom: '1px solid rgba(200,168,75,0.07)',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                color: isLoser ? '#777' : 'var(--gold)',
                textShadow: isChampion ? '0 0 14px rgba(200,168,75,0.5)' : 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
              }}>
                {name}
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.58rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isLoser ? '#555' : 'var(--gold-light)',
                opacity: 0.6,
                marginTop: '2px',
              }}>
                {role}
              </div>
            </div>

            {/* 3 ── Image area */}
            <div style={{
              height: '160px',
              position: 'relative',
              background: 'linear-gradient(160deg, var(--maroon-dark) 0%, var(--dark) 100%)',
              overflow: 'hidden',
            }}>
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    filter: isLoser ? 'grayscale(1) brightness(0.65)' : 'none',
                    display: 'block',
                  }}
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  color: goldColor,
                  opacity: 0.25,
                }}>
                  {name?.[0] ?? '?'}
                </div>
              )}

              {/* Power score badge */}
              {powerScore != null && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: (() => {
                    const t = powerScore / 100
                    const r = Math.round(107 + 93 * t)
                    const g = Math.round(26  + 142 * t)
                    const b = Math.round(42  + 33  * t)
                    return `rgb(${r},${g},${b})`
                  })(),
                  border: '1.5px solid rgba(255,255,255,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.54rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.93)',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.6)',
                  zIndex: 2,
                  lineHeight: 1,
                  letterSpacing: 0,
                }}>
                  {powerScore}
                </div>
              )}

              {/* Champion: gold inner glow */}
              {isChampion && (
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  boxShadow: 'inset 0 0 24px rgba(200,168,75,0.22), inset 0 0 60px rgba(200,168,75,0.08)',
                }} />
              )}

              {/* Champion: holographic shimmer overlay */}
              {isChampion && (
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255,224,102,0.06) 35%, rgba(139,92,246,0.07) 65%, transparent 100%)',
                  animation: 'shimmer 3s ease-in-out infinite',
                  mixBlendMode: 'screen',
                }} />
              )}
            </div>

            {/* 4 ── Flavor text */}
            {flavorText && (
              <div style={{
                margin: '8px 10px',
                padding: '5px 8px',
                borderLeft: `3px solid ${isLoser ? '#444' : 'var(--gold)'}`,
                background: 'rgba(0,0,0,0.28)',
                borderRadius: '0 4px 4px 0',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.7rem',
                  fontStyle: 'italic',
                  color: textColor,
                  opacity: isLoser ? 0.5 : 0.72,
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                  "{flavorText}"
                </p>
              </div>
            )}

            {/* 5 ── Stats grid */}
            {stats.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                margin: '0 10px 8px',
                border: `1px solid ${isLoser ? 'rgba(70,70,70,0.35)' : 'rgba(200,168,75,0.18)'}`,
                borderRadius: '6px',
                overflow: 'hidden',
              }}>
                {stats.map(({ label, value }, i) => (
                  <div key={label} style={{
                    textAlign: 'center',
                    padding: '7px 4px 5px',
                    background: 'rgba(13,5,8,0.65)',
                    borderLeft: i > 0
                      ? `1px solid ${isLoser ? 'rgba(70,70,70,0.35)' : 'rgba(200,168,75,0.15)'}`
                      : 'none',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: isChampion ? 'var(--gold)' : isLoser ? '#555' : 'var(--cream)',
                      lineHeight: 1,
                    }}>
                      {value}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.48rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isLoser ? '#444' : 'var(--gold)',
                      opacity: 0.65,
                      marginTop: '3px',
                    }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6 ── Footer */}
            <div style={{
              padding: '5px 10px 8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${isLoser ? 'rgba(55,55,55,0.4)' : 'rgba(200,168,75,0.1)'}`,
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.52rem',
                letterSpacing: '0.08em',
                color: goldColor,
                opacity: 0.5,
              }}>
                CD-{season} · #{cardNumber}
              </span>

              {/* Rarity dots */}
              <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: i === 0 ? '7px' : '5px',
                    height: i === 0 ? '7px' : '5px',
                    borderRadius: '50%',
                    background: isChampion
                      ? (i === 0 ? 'var(--gold)' : i === 1 ? 'var(--gold-light)' : 'rgba(200,168,75,0.45)')
                      : isLoser
                      ? `rgba(80,80,80,${i === 0 ? 0.55 : 0.25})`
                      : `rgba(200,168,75,${i === 0 ? 0.65 : 0.22})`,
                    boxShadow: isChampion && i === 0 ? '0 0 6px rgba(200,168,75,0.7)' : 'none',
                  }} />
                ))}
              </div>
            </div>

          </div>{/* end inner card */}
        </div>{/* end border wrapper */}
      </motion.div>{/* end tilt */}
    </div>/* end float */
  )
}
