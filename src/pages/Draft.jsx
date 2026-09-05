import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DRAFT_TEAMS, GRADE_COLORS, PREDICTED_STANDINGS } from '../data/draftBoard2026'

/* Best grade first, so the page reads like a ranking. */
const GRADE_ORDER = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D']
const RANKED_TEAMS = [...DRAFT_TEAMS].sort(
  (a, b) => GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade)
)

/* ─── Section label + extending line ─────────────────────────────────── */
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

/* ─── Grade badge ─────────────────────────────────────────────────────── */
function GradeBadge({ grade }) {
  const color = GRADE_COLORS[grade] || 'var(--gold)'
  return (
    <div style={{
      position: 'absolute',
      top: '-14px',
      right: '1.5rem',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: 'linear-gradient(160deg, rgba(13,5,8,0.95), rgba(61,10,20,0.95))',
      border: `2px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: grade.length > 1 ? '0.95rem' : '1.1rem',
      color,
      textShadow: `0 0 12px ${color}66`,
      boxShadow: `0 0 16px ${color}33`,
    }}>
      {grade}
    </div>
  )
}

/* ─── Roster table (collapsible) ─────────────────────────────────────── */
function RosterTable({ picks }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      style={{ overflow: 'hidden' }}
    >
      <div style={{
        borderTop: '1px solid rgba(200,168,75,0.12)',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {picks.map(p => (
          <div key={p.round} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 8px',
            borderRadius: '6px',
            background: p.round % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.6rem',
              color: 'rgba(200,168,75,0.4)',
              width: '18px',
              flexShrink: 0,
            }}>
              {p.round}.
            </span>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.55rem',
              letterSpacing: '0.05em',
              color: 'var(--gold)',
              opacity: 0.6,
              width: '30px',
              flexShrink: 0,
            }}>
              {p.pos}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              color: 'var(--cream)',
              opacity: 0.85,
              flex: 1,
            }}>
              {p.player}
            </span>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.6rem',
              color: 'var(--cream)',
              opacity: 0.35,
            }}>
              {p.nfl}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Team draft grade card ───────────────────────────────────────────── */
function DraftCard({ team, i }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      style={{
        position: 'relative',
        border: '1px solid rgba(200,168,75,0.18)',
        borderRadius: '14px',
        padding: '1.75rem',
        background: 'rgba(13,5,8,0.55)',
        width: '100%',
      }}
    >
      <GradeBadge grade={team.grade} />

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.3rem',
        color: 'var(--gold)',
        marginBottom: '0.6rem',
      }}>
        {team.manager}
      </h3>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        color: 'var(--cream)',
        opacity: 0.65,
        lineHeight: 1.6,
        marginBottom: '1rem',
      }}>
        {team.blurb}
      </p>

      <button
        onClick={() => setOpen(v => !v)}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.6rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: open ? 'rgba(200,168,75,0.5)' : 'var(--gold)',
          background: 'transparent',
          border: '1px solid rgba(200,168,75,0.25)',
          borderRadius: '20px',
          padding: '5px 14px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,168,75,0.07)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {open ? '✕ Hide Roster' : '📋 Full Roster'}
      </button>

      <AnimatePresence>
        {open && <RosterTable picks={team.picks} />}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Predicted standings row ─────────────────────────────────────────── */
function StandingsRow({ row, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: i * 0.05 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '0.9rem 1.25rem',
        borderRadius: '10px',
        border: `1px solid ${row.tag === 'champion' ? 'rgba(200,168,75,0.4)' : row.tag === 'toilet' ? 'rgba(180,60,60,0.25)' : 'rgba(200,168,75,0.12)'}`,
        background: row.tag === 'champion'
          ? 'linear-gradient(135deg, rgba(200,168,75,0.1), rgba(13,5,8,0.4))'
          : 'rgba(13,5,8,0.4)',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.4rem',
        color: row.tag === 'champion' ? 'var(--gold-bright)' : row.tag === 'toilet' ? 'rgba(180,100,100,0.7)' : 'var(--gold)',
        opacity: row.tag ? 1 : 0.7,
        width: '32px',
        flexShrink: 0,
        textAlign: 'center',
      }}>
        {row.rank}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            color: 'var(--gold)',
          }}>
            {row.manager}
          </span>
          {row.tag === 'champion' && <span style={{ fontSize: '0.9rem' }}>🏆</span>}
          {row.tag === 'toilet' && <span style={{ fontSize: '0.9rem' }}>🚽</span>}
        </div>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--cream)',
          opacity: 0.55,
          lineHeight: 1.5,
          margin: 0,
        }}>
          {row.blurb}
        </p>
      </div>
    </motion.div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function Draft() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 2rem 6rem' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          color: 'var(--gold)',
          textShadow: '0 0 30px rgba(200,168,75,0.35)',
          marginBottom: '0.6rem',
        }}>
          🏈 2026 Draft
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--cream)',
          opacity: 0.38,
          letterSpacing: '0.08em',
        }}>
          Grading the rosters. Predicting the chaos.
        </p>
        <div style={{
          width: '80px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)',
          margin: '1.5rem auto 0',
        }} />
      </motion.div>

      {/* Draft grades */}
      <section style={{ marginBottom: '4rem' }}>
        <SectionLabel icon="📝" label="Draft Grades" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}>
          {RANKED_TEAMS.map((team, i) => (
            <DraftCard key={team.id} team={team} i={i} />
          ))}
        </div>
      </section>

      {/* Predicted standings */}
      <section>
        <SectionLabel icon="🔮" label="2026 Predicted Standings" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {PREDICTED_STANDINGS.map((row, i) => (
            <StandingsRow key={row.manager} row={row} i={i} />
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.7rem',
        color: 'var(--cream)',
        opacity: 0.28,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: '3rem',
      }}>
        Grades are half-PPR takes built on 2026 projections, ADP and injury status — not science.
        Standings blend this draft grade with each manager's all-time power score. Ask again in January.
      </p>

    </div>
  )
}
