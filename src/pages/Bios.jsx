import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import members from '../data/members'
import PokeCard from '../components/cards/PokeCard'
import FantasyCard from '../components/cards/FantasyCard'
import { POKE_CARDS } from '../data/pokeCards'
import { POWER_SCORES } from '../data/archiveData'

/* ─── All-time stats ─────────────────────────────────────────────────────
   Front: Seasons, Titles, Toilets
   Back:  Seasons played, Cumulative record, PF/yr, PA/yr, Title years
   ─────────────────────────────────────────────────────────────────────── */
const MEMBER_STATS = {
  joe:    { seasons: 13, titles: 2, toilets: 1, record: '106–69', pfPerYear: 1511, paPerYear: 1387, titleYears: '2024, 2025' },
  mike:   { seasons: 13, titles: 2, toilets: 0, record: '91–83',  pfPerYear: 1442, paPerYear: 1431, titleYears: '2014, 2023' },
  ben:    { seasons: 13, titles: 2, toilets: 2, record: '88–87',  pfPerYear: 1407, paPerYear: 1423, titleYears: '2013, 2021' },
  ollie:  { seasons: 13, titles: 1, toilets: 0, record: '91–84',  pfPerYear: 1473, paPerYear: 1407, titleYears: '2017'       },
  dave:   { seasons: 13, titles: 1, toilets: 1, record: '92–83',  pfPerYear: 1456, paPerYear: 1422, titleYears: '2018'       },
  andy:   { seasons: 13, titles: 1, toilets: 1, record: '94–81',  pfPerYear: 1441, paPerYear: 1416, titleYears: '2022'       },
  kenley: { seasons: 13, titles: 1, toilets: 2, record: '79–96',  pfPerYear: 1375, paPerYear: 1450, titleYears: '2015'       },
  bobby:  { seasons: 13, titles: 1, toilets: 5, record: '75–98',  pfPerYear: 1380, paPerYear: 1457, titleYears: '2016'       },
  jack:   { seasons: 13, titles: 1, toilets: 0, record: '75–98',  pfPerYear: 1422, paPerYear: 1446, titleYears: '2020'       },
  kiri:   { seasons: 9,  titles: 1, toilets: 0, record: '57–65',  pfPerYear: 1412, paPerYear: 1492, titleYears: '2019'       },
  tj:     { seasons: 3,  titles: 0, toilets: 1, record: '17–22',  pfPerYear: 1234, paPerYear: 1337, titleYears: '—'           },
  eric:   { seasons: 1,  titles: 0, toilets: 0, record: '7–7',    pfPerYear: 1464, paPerYear: 1506, titleYears: '—'           },
}

/* ─── Per-member overrides ───────────────────────────────────────────── */
const TYPE_LABEL_OVERRIDES = {
  joe:   'Member and Current Champion',
  bobby: 'Member and Current Toilet',
}

/* ─── Card back face ──────────────────────────────────────────────────── */
function CardBack({ member, variant, onReturn }) {
  const s = MEMBER_STATS[member.id] || {}
  const isLoser = variant === 'loser'

  return (
    <div style={{
      width: '220px',
      minHeight: '370px',
      background: isLoser
        ? 'linear-gradient(160deg, #111 0%, #1c1c1c 100%)'
        : 'linear-gradient(160deg, rgba(61,10,20,0.97) 0%, rgba(13,5,8,0.99) 100%)',
      border: `2px solid ${isLoser ? 'rgba(80,80,80,0.5)' : 'rgba(200,168,75,0.38)'}`,
      borderRadius: '13px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 1rem',
      gap: '0.9rem',
      textAlign: 'center',
    }}>

      {/* Crest */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: isLoser
          ? 'linear-gradient(135deg, #1a1a1a, #111)'
          : 'linear-gradient(135deg, var(--maroon), var(--maroon-dark))',
        border: `1px solid ${isLoser ? 'rgba(80,80,80,0.3)' : 'rgba(200,168,75,0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        flexShrink: 0,
        filter: isLoser ? 'grayscale(1) brightness(0.6)' : 'none',
      }}>
        ⚡
      </div>

      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.25rem',
        color: isLoser ? '#777' : 'var(--gold)',
        lineHeight: 1.1,
      }}>
        {member.name}
      </div>

      {/* Location */}
      {member.location && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          color: isLoser ? '#555' : 'var(--cream)',
          opacity: 0.5,
          letterSpacing: '0.06em',
          marginTop: '-0.4rem',
        }}>
          📍 {member.location}
        </div>
      )}

      {/* Stats rows */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {[
          ['Seasons Played',  s.seasons    ?? '—'],
          ['Record',          s.record     ?? '—'],
          ['Pts For / Year',  s.pfPerYear  ?? '—'],
          ['Pts Against / Yr',s.paPerYear  ?? '—'],
          ['Title Year(s)',   s.titleYears ?? '—'],
        ].map(([label, value]) => (
          <div key={label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '5px 10px',
            borderRadius: '4px',
            background: isLoser ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.3)',
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.55rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isLoser ? '#555' : 'var(--gold)',
              opacity: 0.65,
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: isLoser ? '#666' : 'var(--cream)',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Return button */}
      <ReturnBtn onClick={(e) => { e.stopPropagation(); onReturn() }} isLoser={isLoser} />
    </div>
  )
}

function ReturnBtn({ onClick, isLoser }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginTop: '0.1rem',
        padding: '6px 20px',
        fontFamily: 'var(--font-serif)',
        fontSize: '0.6rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: isLoser ? '#666' : 'var(--gold)',
        background: hovered
          ? (isLoser ? 'rgba(100,100,100,0.15)' : 'rgba(200,168,75,0.18)')
          : (isLoser ? 'rgba(100,100,100,0.05)' : 'rgba(200,168,75,0.07)'),
        border: `1px solid ${hovered
          ? (isLoser ? 'rgba(100,100,100,0.5)' : 'rgba(200,168,75,0.65)')
          : (isLoser ? 'rgba(80,80,80,0.35)' : 'rgba(200,168,75,0.32)')}`,
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      Return to League
    </button>
  )
}

/* ─── Flip wrapper ────────────────────────────────────────────────────── */
function CardFlipper({ member, cardNumber, variant }) {
  const [flipped, setFlipped] = useState(false)
  const s          = MEMBER_STATS[member.id] || {}
  const powerScore = POWER_SCORES[member.id] ?? null
  const typeLabel  = TYPE_LABEL_OVERRIDES[member.id] ?? null

  return (
    <div
      style={{ perspective: '1000px', width: '220px', cursor: 'pointer' }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, type: 'spring', stiffness: 100, damping: 20 }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: '220px' }}
      >
        {/* Front */}
        <div style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}>
          <PokeCard
            variant={variant}
            name={member.name}
            role={member.role}
            photo={member.photo}
            photoPosition={member.photoPosition}
            flavorText={member.flavorText}
            stats={[
              { label: 'Seasons', value: String(s.seasons  ?? '?') },
              { label: 'Titles',  value: String(s.titles   ?? '0') },
              { label: 'Toilets', value: String(s.toilets  ?? '0') },
            ]}
            cardNumber={cardNumber}
            season="2025"
            powerScore={powerScore}
            typeLabel={typeLabel}
          />
        </div>

        {/* Back */}
        <div style={{
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }}>
          <CardBack member={member} variant={variant} onReturn={() => setFlipped(false)} />
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Section label + extending line ─────────────────────────────────── */
function SectionLabel({ icon, label, faded = false, fantasy = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.68rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: fantasy ? '#a855f7' : 'var(--gold)',
        opacity: faded ? 0.5 : 0.8,
        whiteSpace: 'nowrap',
      }}>
        {icon} {label}
      </span>
      <div style={{
        flex: 1,
        height: '1px',
        background: fantasy
          ? `linear-gradient(90deg, rgba(168,85,247,${faded ? '0.2' : '0.4'}), transparent)`
          : `linear-gradient(90deg, rgba(200,168,75,${faded ? '0.18' : '0.3'}), transparent)`,
      }} />
    </div>
  )
}

/* ─── Mode toggle ─────────────────────────────────────────────────────── */
function ModeToggle({ fantasyMode, onToggle }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      marginBottom: '3rem',
    }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.68rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: fantasyMode ? 'rgba(255,255,255,0.35)' : 'var(--gold)',
        transition: 'color 0.3s ease',
        userSelect: 'none',
      }}>
        Real Life
      </span>

      {/* Toggle switch */}
      <button
        onClick={() => onToggle(!fantasyMode)}
        aria-label="Toggle fantasy mode"
        style={{
          position: 'relative',
          width: '48px',
          height: '26px',
          borderRadius: '13px',
          border: 'none',
          cursor: 'pointer',
          background: fantasyMode
            ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
            : 'rgba(200,168,75,0.3)',
          transition: 'background 0.3s ease',
          padding: 0,
          boxShadow: fantasyMode
            ? '0 0 12px rgba(168,85,247,0.5)'
            : 'none',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '3px',
          left: fantasyMode ? '25px' : '3px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>

      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.68rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: fantasyMode ? '#a855f7' : 'rgba(255,255,255,0.35)',
        textShadow: fantasyMode ? '0 0 12px rgba(168,85,247,0.6)' : 'none',
        transition: 'color 0.3s ease, text-shadow 0.3s ease',
        userSelect: 'none',
      }}>
        Just Fantasy
      </span>

      {/* Secret badge */}
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.48rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: fantasyMode ? '#fbbf24' : 'rgba(168,85,247,0.6)',
        border: `1px solid ${fantasyMode ? 'rgba(251,191,36,0.5)' : 'rgba(168,85,247,0.4)'}`,
        borderRadius: '3px',
        padding: '2px 5px',
        animation: 'secretPulse 2s ease-in-out infinite',
        transition: 'color 0.3s ease, border-color 0.3s ease',
      }}>
        ✦ SECRET
      </span>
    </div>
  )
}

/* ─── Tooltip ─────────────────────────────────────────────────────────── */
function FantasyTooltip({ onDismiss }) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          marginTop: '60vh',
          background: 'rgba(15, 5, 30, 0.92)',
          border: '1px solid rgba(168,85,247,0.4)',
          borderRadius: '8px',
          padding: '10px 20px',
          fontFamily: 'var(--font-serif)',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          color: '#a855f7',
          textAlign: 'center',
          boxShadow: '0 0 24px rgba(168,85,247,0.2)',
          pointerEvents: 'auto',
        }}
      >
        Click any card to reveal ✦
      </motion.div>
    </div>
  )
}

/* ─── Fantasy mode card grid ──────────────────────────────────────────── */
const ACTIVE_POKE_ORDER = ['joe','mike','ben','ollie','dave','andy','kiri','jack','kenley','bobby']

function FantasySection({ ids, label, icon, faded = false }) {
  const cards = ids.map(id => POKE_CARDS.find(c => c.id === id)).filter(Boolean)
  return (
    <section style={{ marginBottom: '4rem' }}>
      <SectionLabel icon={icon} label={label} faded={faded} fantasy />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        justifyItems: 'center',
      }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <FantasyCard card={card} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function Bios() {
  const [fantasyMode, setFantasyMode] = useState(
    () => sessionStorage.getItem('fantasyMode') === 'true'
  )
  const [showTooltip, setShowTooltip] = useState(false)

  const activeMembers = members.filter(m => m.active && !m.alumni)
  const alumniMembers = members.filter(m => m.alumni)

  const joe = activeMembers.find(m => m.id === 'joe')
  const POWER_ORDER = ['mike','ben','ollie','dave','andy','kiri','jack','kenley','bobby']
  const crew = POWER_ORDER
    .map(id => activeMembers.find(m => m.id === id))
    .filter(Boolean)

  const handleToggle = (val) => {
    setFantasyMode(val)
    sessionStorage.setItem('fantasyMode', String(val))
    if (val && !sessionStorage.getItem('hasSeenFantasyTooltip')) {
      setShowTooltip(true)
    }
  }

  const dismissTooltip = () => {
    setShowTooltip(false)
    sessionStorage.setItem('hasSeenFantasyTooltip', 'true')
  }

  useEffect(() => {
    if (!showTooltip) return
    const handler = () => dismissTooltip()
    document.addEventListener('click', handler, { once: true })
    return () => document.removeEventListener('click', handler)
  }, [showTooltip])

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Fantasy background overlay */}
      <AnimatePresence>
        {fantasyMode && (
          <motion.div
            className="fantasy-bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && <FantasyTooltip onDismiss={dismissTooltip} />}
      </AnimatePresence>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem 6rem', position: 'relative', zIndex: 1 }}>

        {/* ── Page header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            color: fantasyMode ? '#e9d5ff' : 'var(--gold)',
            textShadow: fantasyMode
              ? '0 0 30px rgba(168,85,247,0.6)'
              : '0 0 30px rgba(200,168,75,0.35)',
            marginBottom: '0.6rem',
            transition: 'color 0.4s ease, text-shadow 0.4s ease',
          }}>
            The Crew
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--cream)',
            opacity: 0.38,
            letterSpacing: '0.08em',
          }}>
            10 active members. 2 legends. 1 league.
          </p>
          <div style={{
            width: '80px',
            height: '1px',
            background: fantasyMode
              ? 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)',
            margin: '1.5rem auto 0',
            transition: 'background 0.4s ease',
          }} />
        </motion.div>

        {/* ── Mode toggle ─────────────────────────────────────── */}
        <ModeToggle fantasyMode={fantasyMode} onToggle={handleToggle} />

        {/* ── Content ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {fantasyMode ? (
            <motion.div
              key="fantasy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FantasySection
                ids={ACTIVE_POKE_ORDER}
                label="Active Managers"
                icon="⚡"
              />
              <section>
                <SectionLabel icon="🏛" label="League Alumni" faded fantasy />
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  color: 'var(--cream)',
                  opacity: 0.32,
                  fontStyle: 'italic',
                  marginBottom: '1.75rem',
                }}>
                  Former members of the Colgate Diaspora. Always in spirit.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '24px',
                  justifyItems: 'center',
                }}>
                  {POKE_CARDS.filter(c => c.alumni).map((card, i) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <FantasyCard card={card} />
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="reallife"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* ── Joe: Current Champion — top center ─────────── */}
              {joe && (
                <section style={{ marginBottom: '4rem' }}>
                  <SectionLabel icon="🏆" label="Current Champion" />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0,  scale: 1    }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardFlipper
                        member={joe}
                        cardNumber="000"
                        variant="champion"
                      />
                    </motion.div>
                  </div>
                </section>
              )}

              {/* ── The Crew — 3×3 grid ─────────────────────────── */}
              <section style={{ marginBottom: '5rem' }}>
                <SectionLabel icon="⚡" label="The Crew" />
                <motion.div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 220px)',
                    gap: '2rem',
                    justifyContent: 'center',
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {crew.map((m, i) => (
                      <motion.div
                        key={m.id}
                        layout
                        initial={{ opacity: 0, y: 24, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0,  scale: 1   }}
                        exit={{    opacity: 0,         scale: 0.85 }}
                        transition={{ duration: 0.3, delay: i * 0.07 }}
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <CardFlipper
                          member={m}
                          cardNumber={String(i + 1).padStart(3, '0')}
                          variant={m.id === 'bobby' ? 'loser' : 'member'}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>

              {/* ── Alumni ─────────────────────────────────────── */}
              <section>
                <SectionLabel icon="🏛" label="League Alumni" faded />
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  color: 'var(--cream)',
                  opacity: 0.32,
                  fontStyle: 'italic',
                  marginBottom: '1.75rem',
                }}>
                  Former members of the Colgate Diaspora. Always in spirit.
                </p>
                <motion.div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem',
                    justifyItems: 'center',
                  }}
                >
                  {alumniMembers.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 20, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0,  scale: 1    }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <CardFlipper
                        member={m}
                        cardNumber={String(activeMembers.length + i + 1).padStart(3, '0')}
                        variant="alumni"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
