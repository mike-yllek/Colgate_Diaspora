import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import members from '../data/members'
import PokeCard from '../components/cards/PokeCard'

/* ─── Placeholder stats — update when real data is ready ─────────────── */
const MEMBER_STATS = {
  ollie:  { seasons: 12, titles: 3, best: '1st',  record: '132–36' },
  mike:   { seasons: 12, titles: 2, best: '1st',  record: '110–58' },
  jack:   { seasons: 12, titles: 1, best: '1st',  record:  '98–70' },
  ben:    { seasons: 12, titles: 0, best: '2nd',  record:  '88–80' },
  dave:   { seasons: 12, titles: 0, best: '5th',  record:  '72–96' },
  andy:   { seasons: 12, titles: 1, best: '1st',  record: '102–66' },
  kenley: { seasons: 12, titles: 1, best: '1st',  record: '105–63' },
  kiri:   { seasons:  6, titles: 0, best: '3rd',  record:  '48–48' },
  joe:    { seasons:  8, titles: 0, best: '2nd',  record:  '66–62' },
  bobby:  { seasons:  5, titles: 0, best: '4th',  record:  '38–42' },
  tj:     { seasons:  8, titles: 1, best: '1st',  record:  '76–52' },
  eric:   { seasons:  4, titles: 0, best: '3rd',  record:  '30–34' },
}

const FILTERS = [
  { id: 'all',        label: 'All'              },
  { id: 'colgate12',  label: "Colgate '12"      },
  { id: 'associates', label: 'League Associates' },
  { id: 'alumni',     label: 'Alumni'           },
]

/* ─── Card back face ──────────────────────────────────────────────────── */
function CardBack({ member, onReturn }) {
  const s = MEMBER_STATS[member.id] || {}

  return (
    <div style={{
      width: '220px',
      minHeight: '370px',
      background: 'linear-gradient(160deg, rgba(61,10,20,0.97) 0%, rgba(13,5,8,0.99) 100%)',
      border: '2px solid rgba(200,168,75,0.38)',
      borderRadius: '13px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 1rem',
      gap: '1rem',
      textAlign: 'center',
    }}>

      {/* Crest */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--maroon), var(--maroon-dark))',
        border: '1px solid rgba(200,168,75,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        flexShrink: 0,
      }}>
        ⚡
      </div>

      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.35rem',
        color: 'var(--gold)',
        lineHeight: 1.1,
      }}>
        {member.name}
      </div>

      {/* Stats rows */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {[
          ['Seasons Played', s.seasons ?? '—'],
          ['Record',         s.record  ?? '—–—'],
          ['Best Finish',    s.best    ?? '—'],
          ['Titles',         s.titles  ?? 0],
        ].map(([label, value]) => (
          <div key={label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '5px 10px',
            borderRadius: '4px',
            background: 'rgba(0,0,0,0.3)',
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              opacity: 0.55,
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--cream)',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Return button */}
      <ReturnBtn onClick={(e) => { e.stopPropagation(); onReturn() }} />
    </div>
  )
}

function ReturnBtn({ onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginTop: '0.25rem',
        padding: '6px 20px',
        fontFamily: 'var(--font-serif)',
        fontSize: '0.6rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        background: hovered ? 'rgba(200,168,75,0.18)' : 'rgba(200,168,75,0.07)',
        border: `1px solid ${hovered ? 'rgba(200,168,75,0.65)' : 'rgba(200,168,75,0.32)'}`,
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
  const s = MEMBER_STATS[member.id] || {}

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
            flavorText={member.flavorText}
            stats={[
              { label: 'Seasons', value: String(s.seasons ?? '?') },
              { label: 'Titles',  value: String(s.titles  ?? '0') },
              { label: 'Best',    value: s.best ?? '—'            },
            ]}
            cardNumber={cardNumber}
            season="2024"
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
          <CardBack member={member} onReturn={() => setFlipped(false)} />
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Filter pill ─────────────────────────────────────────────────────── */
function FilterBtn({ id, label, active, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={() => onClick(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 20px',
        fontFamily: 'var(--font-serif)',
        fontSize: '0.68rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: active ? 'var(--dark)' : 'var(--gold)',
        background: active ? 'var(--gold)' : hovered ? 'rgba(200,168,75,0.12)' : 'rgba(200,168,75,0.06)',
        border: `1px solid ${active ? 'var(--gold)' : hovered ? 'rgba(200,168,75,0.55)' : 'rgba(200,168,75,0.25)'}`,
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

/* ─── Member grid with stagger + layout animations ───────────────────── */
function MemberGrid({ items, cardOffset, variant }) {
  return (
    <motion.div
      layout
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '2rem',
        justifyItems: 'center',
      }}
    >
      <AnimatePresence mode="popLayout">
        {items.map((m, i) => (
          <motion.div
            key={m.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1   }}
            exit={{    opacity: 0,         scale: 0.85 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <CardFlipper
              member={m}
              cardNumber={String(cardOffset + i + 1).padStart(3, '0')}
              variant={variant}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Section label + extending gold line ────────────────────────────── */
function SectionLabel({ icon, label, faded = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.68rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        opacity: faded ? 0.5 : 0.8,
        whiteSpace: 'nowrap',
      }}>
        {icon} {label}
      </span>
      <div style={{
        flex: 1,
        height: '1px',
        background: `linear-gradient(90deg, rgba(200,168,75,${faded ? '0.18' : '0.3'}), transparent)`,
      }} />
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function Bios() {
  const [filter, setFilter] = useState('all')

  const activeMembers = members.filter(m => m.active && !m.alumni)
  const alumniMembers = members.filter(m => m.alumni)

  const filteredActive =
    filter === 'alumni'     ? [] :
    filter === 'all'        ? activeMembers :
    filter === 'colgate12'  ? activeMembers.filter(m => m.class === "Colgate '12") :
    filter === 'associates' ? activeMembers.filter(m => m.class === 'League Associate') :
    activeMembers

  const showActive = filter !== 'alumni' && filteredActive.length > 0
  const showAlumni = filter === 'all' || filter === 'alumni'

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem 6rem' }}>

      {/* ── Page header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          color: 'var(--gold)',
          textShadow: '0 0 30px rgba(200,168,75,0.35)',
          marginBottom: '0.6rem',
        }}>
          The Managers
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
          background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)',
          margin: '1.5rem auto 0',
        }} />
      </motion.div>

      {/* ── Filter bar ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '3.5rem',
        }}
      >
        {FILTERS.map(f => (
          <FilterBtn
            key={f.id}
            id={f.id}
            label={f.label}
            active={filter === f.id}
            onClick={setFilter}
          />
        ))}
      </motion.div>

      {/* ── Active managers ──────────────────────────────────────── */}
      {showActive && (
        <section style={{ marginBottom: '5rem' }}>
          <SectionLabel icon="⚡" label="Active Managers" />
          <MemberGrid items={filteredActive} cardOffset={0} variant="member" />
        </section>
      )}

      {/* ── Alumni ───────────────────────────────────────────────── */}
      {showAlumni && (
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
          <MemberGrid
            items={alumniMembers}
            cardOffset={activeMembers.length}
            variant="alumni"
          />
        </section>
      )}

    </div>
  )
}
