import { useState } from 'react'
import { motion } from 'framer-motion'
import events from '../data/events'

/* ── Date helpers ─────────────────────────────────────────────────────── */
const TODAY = new Date()

function parseDate(iso) {
  return new Date(iso + 'T12:00:00')
}
function isPast(iso) {
  return parseDate(iso) < TODAY
}
function fmtMonth(iso) {
  return parseDate(iso).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}
function fmtDay(iso) {
  return parseDate(iso).getDate()
}
function fmtYear(iso) {
  return parseDate(iso).getFullYear()
}
function fmtFull(iso) {
  return parseDate(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

/* ── Type metadata ────────────────────────────────────────────────────── */
const TYPE_META = {
  draft:    { color: 'var(--maroon-light)', label: 'Draft',     icon: '📋' },
  deadline: { color: 'var(--gold)',         label: 'Deadline',  icon: '⚡' },
  playoffs: { color: '#4a90d9',             label: 'Playoffs',  icon: '🏆' },
  meetup:   { color: '#4caf75',             label: 'Meetup',    icon: '🍺' },
  other:    { color: 'rgba(245,240,232,0.6)', label: 'Event',   icon: '🏈' },
}

/* ── Season timeline config ───────────────────────────────────────────── */
const T_START   = new Date('2025-08-01T12:00:00')
const T_END     = new Date('2026-02-01T12:00:00')
const T_SPAN_MS = T_END - T_START

const T_MONTHS = [
  { label: 'AUG', iso: '2025-08-01' },
  { label: 'SEP', iso: '2025-09-01' },
  { label: 'OCT', iso: '2025-10-01' },
  { label: 'NOV', iso: '2025-11-01' },
  { label: 'DEC', iso: '2025-12-01' },
  { label: 'JAN', iso: '2026-01-01' },
  { label: 'FEB', iso: '2026-02-01' },
]

const T_MILESTONES = [
  { label: 'Draft',     iso: '2025-08-28', above: true  },
  { label: 'Week 1',   iso: '2025-09-04', above: false },
  { label: 'Deadline', iso: '2025-11-15', above: true  },
  { label: 'Playoffs', iso: '2025-12-09', above: false },
  { label: 'Champ',    iso: '2025-12-23', above: true  },
]

function tPct(iso) {
  const ms = parseDate(iso) - T_START
  return Math.min(100, Math.max(0, (ms / T_SPAN_MS) * 100))
}

const todayPct = Math.min(100, Math.max(0, ((TODAY - T_START) / T_SPAN_MS) * 100))

/* ── Season timeline ──────────────────────────────────────────────────── */
function SeasonTimeline() {
  return (
    <div style={{
      padding: '2rem 1.5rem 1.5rem',
      border: '1px solid rgba(200,168,75,0.15)',
      borderRadius: 'var(--card-radius)',
      background: 'rgba(107,26,42,0.06)',
      marginBottom: '4rem',
    }}>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.65rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        opacity: 0.65,
        marginBottom: '2.5rem',
      }}>
        🏈 2025–2026 Season at a Glance
      </div>

      {/* Timeline bar area */}
      <div style={{ position: 'relative', height: '80px', margin: '0 8px' }}>

        {/* Milestone labels (above) */}
        {T_MILESTONES.filter(m => m.above).map(m => (
          <div key={m.label} style={{
            position: 'absolute',
            left: `${tPct(m.iso)}%`,
            bottom: '54px',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.52rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              opacity: 0.7,
              whiteSpace: 'nowrap',
              marginBottom: '3px',
            }}>
              {m.label}
            </div>
            <div style={{ width: '1px', height: '10px', background: 'rgba(200,168,75,0.35)', margin: '0 auto' }} />
          </div>
        ))}

        {/* The bar */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          height: '4px',
          background: 'rgba(200,168,75,0.1)',
          borderRadius: '2px',
        }}>
          {/* Filled portion (past) */}
          <div style={{
            position: 'absolute',
            left: 0,
            width: `${Math.min(100, todayPct)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, rgba(200,168,75,0.3), rgba(200,168,75,0.6))',
            borderRadius: '2px',
          }} />
        </div>

        {/* Milestone dots */}
        {T_MILESTONES.map(m => {
          const pct   = tPct(m.iso)
          const past  = isPast(m.iso)
          return (
            <div key={m.label} style={{
              position: 'absolute',
              left: `${pct}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: past ? 'var(--gold)' : 'rgba(200,168,75,0.25)',
              border: `2px solid ${past ? 'var(--gold)' : 'rgba(200,168,75,0.4)'}`,
              boxShadow: past ? '0 0 6px rgba(200,168,75,0.55)' : 'none',
              zIndex: 2,
            }} />
          )
        })}

        {/* TODAY marker */}
        {todayPct >= 0 && todayPct <= 100 && (
          <div style={{
            position: 'absolute',
            left: `${todayPct}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
          }}>
            <div style={{
              width: '12px', height: '12px', borderRadius: '50%',
              background: 'var(--gold)',
              border: '2px solid var(--gold-light)',
              boxShadow: '0 0 10px rgba(200,168,75,0.8)',
            }} />
            <div style={{
              position: 'absolute',
              top: '14px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.45rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              whiteSpace: 'nowrap',
            }}>
              Today
            </div>
          </div>
        )}

        {/* Milestone labels (below) */}
        {T_MILESTONES.filter(m => !m.above).map(m => (
          <div key={m.label} style={{
            position: 'absolute',
            left: `${tPct(m.iso)}%`,
            top: '52px',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ width: '1px', height: '10px', background: 'rgba(200,168,75,0.35)', margin: '0 auto 3px' }} />
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.52rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              opacity: 0.7,
              whiteSpace: 'nowrap',
            }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Month labels */}
      <div style={{ position: 'relative', marginTop: '2.5rem', height: '16px' }}>
        {T_MONTHS.map(m => (
          <div key={m.label} style={{
            position: 'absolute',
            left: `${tPct(m.iso)}%`,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            color: 'var(--cream)',
            opacity: 0.25,
          }}>
            {m.label}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Upcoming event card ──────────────────────────────────────────────── */
function UpcomingEventCard({ event, index }) {
  const [hovered, setHovered] = useState(false)
  const meta = TYPE_META[event.type] || TYPE_META.other

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'flex-start',
        padding: '1.5rem',
        border: `1px solid ${hovered ? 'rgba(200,168,75,0.5)' : 'rgba(200,168,75,0.18)'}`,
        borderRadius: 'var(--card-radius)',
        background: hovered ? 'rgba(107,26,42,0.12)' : 'rgba(107,26,42,0.06)',
        transition: 'border-color 0.22s ease, background 0.22s ease',
        cursor: 'default',
      }}
    >
      {/* Date block */}
      <div style={{
        background: 'linear-gradient(160deg, var(--maroon), var(--maroon-dark))',
        border: '1px solid rgba(200,168,75,0.18)',
        borderRadius: '8px',
        padding: '10px 14px',
        textAlign: 'center',
        minWidth: '68px',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.58rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.8,
        }}>
          {fmtMonth(event.date)}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.85rem',
          color: 'var(--gold)',
          lineHeight: 1,
          margin: '2px 0 1px',
        }}>
          {fmtDay(event.date)}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.58rem',
          color: 'var(--cream)',
          opacity: 0.35,
        }}>
          {fmtYear(event.date)}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '0.4rem' }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.58rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: meta.color,
            border: `1px solid ${meta.color}`,
            borderRadius: '4px',
            padding: '2px 7px',
            opacity: 0.9,
          }}>
            {meta.icon} {meta.label}
          </span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.05rem',
          color: 'var(--gold-light)',
          marginBottom: '0.35rem',
          lineHeight: 1.3,
        }}>
          {event.title}
        </h3>
        {event.description && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--cream)',
            opacity: 0.58,
            lineHeight: 1.5,
            marginBottom: event.addToCalendarLink ? '0.75rem' : 0,
          }}>
            {event.description}
          </p>
        )}
        {event.addToCalendarLink && (
          <a
            href={event.addToCalendarLink}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: 'var(--gold)',
              opacity: 0.6,
              textDecoration: 'none',
            }}
          >
            Add to Calendar →
          </a>
        )}
      </div>
    </motion.div>
  )
}

/* ── Past event row ───────────────────────────────────────────────────── */
function PastEventRow({ event }) {
  const [hovered, setHovered] = useState(false)
  const meta = TYPE_META[event.type] || TYPE_META.other

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        background: hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        transition: 'background 0.2s',
        opacity: 0.55,
      }}
    >
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        color: 'var(--cream)',
        opacity: 0.6,
        minWidth: '100px',
        flexShrink: 0,
      }}>
        {fmtMonth(event.date)} {fmtDay(event.date)}, {fmtYear(event.date)}
      </span>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.52rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: meta.color,
        border: `1px solid ${meta.color}`,
        borderRadius: '3px',
        padding: '1px 6px',
        flexShrink: 0,
        opacity: 0.7,
      }}>
        {meta.label}
      </span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.88rem',
        color: 'var(--cream)',
        opacity: 0.7,
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {event.title}
      </span>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.55rem',
        letterSpacing: '0.1em',
        color: 'var(--cream)',
        opacity: 0.25,
        flexShrink: 0,
      }}>
        ✓
      </span>
    </div>
  )
}

/* ── Section heading with extending line ─────────────────────────────── */
function SectionLabel({ children, faded = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.68rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        opacity: faded ? 0.45 : 0.75,
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <div style={{
        flex: 1,
        height: '1px',
        background: `linear-gradient(90deg, rgba(200,168,75,${faded ? '0.15' : '0.28'}), transparent)`,
      }} />
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function Calendar() {
  const sorted   = [...events].sort((a, b) => parseDate(a.date) - parseDate(b.date))
  const upcoming = sorted.filter(e => !isPast(e.date))
  const past     = sorted.filter(e => isPast(e.date)).reverse() // most recent first

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '5rem 2rem 6rem' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3.25rem)',
          color: 'var(--gold)',
          textShadow: '0 0 30px rgba(200,168,75,0.35)',
          marginBottom: '0.6rem',
        }}>
          League Calendar
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--cream)',
          opacity: 0.38,
          letterSpacing: '0.08em',
        }}>
          Key dates for the 2025–2026 season
        </p>
        <div style={{
          width: '80px', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)',
          margin: '1.5rem auto 0',
        }} />
      </motion.div>

      {/* ── Season at a Glance ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <SeasonTimeline />
      </motion.div>

      {/* ── Upcoming events ──────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <SectionLabel>📅 Upcoming</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcoming.map((event, i) => (
              <UpcomingEventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── Past events ──────────────────────────────────────────── */}
      {past.length > 0 && (
        <section>
          <SectionLabel faded>📁 Past Events</SectionLabel>
          <div style={{
            border: '1px solid rgba(200,168,75,0.1)',
            borderRadius: 'var(--card-radius)',
            overflow: 'hidden',
            background: 'rgba(13,5,8,0.4)',
          }}>
            {past.map((event, i) => (
              <div key={event.id} style={{
                borderTop: i > 0 ? '1px solid rgba(245,240,232,0.04)' : 'none',
              }}>
                <PastEventRow event={event} />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
