import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import seasons from '../data/seasons'

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const mostRecentYear = Math.max(...seasons.map(s => s.year))
const inauguralYear  = Math.min(...seasons.map(s => s.year))

function fmt(val) {
  return (!val || val === 'TBD') ? '—' : val
}

/* ─── Sub-components ──────────────────────────────────────────────────── */

function PlatformPill({ platform }) {
  const isESPN = platform === 'ESPN'
  return (
    <span style={{
      fontFamily: 'var(--font-serif)',
      fontSize: '0.55rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color:      isESPN ? '#c5a3ff' : '#7ee8a2',
      background: isESPN ? 'rgba(139,92,246,0.1)' : 'rgba(126,232,162,0.08)',
      border:    `1px solid ${isESPN ? 'rgba(139,92,246,0.3)' : 'rgba(126,232,162,0.25)'}`,
      borderRadius: '4px',
      padding: '3px 8px',
      whiteSpace: 'nowrap',
    }}>
      {platform}
    </span>
  )
}

function YearBadge({ children, gold = false }) {
  return (
    <span style={{
      fontFamily: 'var(--font-serif)',
      fontSize: '0.48rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color:      gold ? 'var(--gold)' : 'var(--cream)',
      background: gold ? 'rgba(200,168,75,0.12)' : 'rgba(255,255,255,0.05)',
      border:    `1px solid ${gold ? 'rgba(200,168,75,0.35)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: '4px',
      padding: '2px 6px',
    }}>
      {children}
    </span>
  )
}

function ResultCell({ icon, label, value, dim = false }) {
  const isEmpty = value === '—'
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.55rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        opacity: 0.42,
        marginBottom: '3px',
      }}>
        {icon} {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.95rem',
        color: 'var(--cream)',
        opacity: isEmpty ? 0.2 : dim ? 0.55 : 0.88,
      }}>
        {value}
      </div>
    </div>
  )
}

/* ─── Season row ──────────────────────────────────────────────────────── */
function SeasonRow({ season, index }) {
  const [hovered,  setHovered]  = useState(false)
  const [expanded, setExpanded] = useState(false)

  const isTBD       = !season.champion || season.champion === 'TBD'
  const isRecent    = season.year === mostRecentYear
  const isInaugural = season.year === inauguralYear
  const hasNotes    = !!season.notes

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      {/* Main row */}
      <div
        onClick={() => hasNotes && setExpanded(e => !e)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 1fr 1fr auto',
          gap: '1rem',
          alignItems: 'center',
          padding: '1.1rem 1.5rem',
          border:     `1px solid ${hovered ? 'rgba(200,168,75,0.42)' : 'rgba(200,168,75,0.14)'}`,
          borderLeft: `3px solid ${isTBD ? 'rgba(200,168,75,0.15)' : 'var(--gold)'}`,
          borderRadius: expanded ? 'var(--card-radius) var(--card-radius) 0 0' : 'var(--card-radius)',
          background: hovered ? 'rgba(107,26,42,0.13)' : 'rgba(107,26,42,0.06)',
          cursor: hasNotes ? 'pointer' : 'default',
          transition: 'border-color 0.2s ease, background 0.2s ease',
        }}
      >
        {/* Year + badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            color: 'var(--gold)',
            lineHeight: 1,
          }}>
            {season.year}
          </span>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {isRecent    && <YearBadge gold>Latest</YearBadge>}
            {isInaugural && <YearBadge>Est.</YearBadge>}
          </div>
        </div>

        <ResultCell icon="🏆" label="Champion"  value={fmt(season.champion)} />
        <ResultCell icon="🥈" label="Runner-Up" value={fmt(season.runnerUp)} />
        <ResultCell icon="💀" label="Last Place" value={fmt(season.lastPlace)} dim />

        {/* Right column: platform + notes hint */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <PlatformPill platform={season.platform} />
          {hasNotes && (
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              color: 'var(--gold)',
              opacity: hovered ? 0.55 : 0.25,
              transition: 'opacity 0.2s',
            }}>
              {expanded ? '▲ less' : '▼ notes'}
            </span>
          )}
        </div>
      </div>

      {/* Expandable notes */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="notes"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0.75rem 1.5rem 0.9rem 1.75rem',
              background: 'rgba(0,0,0,0.28)',
              border: '1px solid rgba(200,168,75,0.14)',
              borderTop: 'none',
              borderLeft: '3px solid rgba(200,168,75,0.2)',
              borderRadius: '0 0 var(--card-radius) var(--card-radius)',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--cream)',
                opacity: 0.52,
                fontStyle: 'italic',
                margin: 0,
              }}>
                {season.notes}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Era divider ─────────────────────────────────────────────────────── */
function EraHeading({ label, range, count, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2.5rem 0 1rem' }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.62rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color,
        opacity: 0.7,
        whiteSpace: 'nowrap',
      }}>
        {label} Era · {range} · {count} {count === 1 ? 'season' : 'seasons'}
      </span>
      <div style={{
        flex: 1,
        height: '1px',
        background: `linear-gradient(90deg, ${color}44, transparent)`,
      }} />
    </div>
  )
}

/* ─── Stat chip ───────────────────────────────────────────────────────── */
function StatChip({ value, label }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '1rem 1.5rem',
      border: '1px solid rgba(200,168,75,0.15)',
      borderRadius: 'var(--card-radius)',
      background: 'rgba(107,26,42,0.08)',
      flex: '1 1 140px',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.6rem',
        color: 'var(--gold)',
        lineHeight: 1,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.58rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--cream)',
        opacity: 0.38,
      }}>
        {label}
      </div>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function Archive() {
  const sorted    = [...seasons].sort((a, b) => b.year - a.year)
  const espnRows  = sorted.filter(s => s.platform === 'ESPN')
  const sleeperRows = sorted.filter(s => s.platform === 'Sleeper')

  const espnRange    = `${Math.min(...espnRows.map(s => s.year))}–${Math.max(...espnRows.map(s => s.year))}`
  const sleeperRange = `${Math.min(...sleeperRows.map(s => s.year))}–${Math.max(...sleeperRows.map(s => s.year))}`

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '5rem 2rem 6rem' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
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
          The Archive
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--cream)',
          opacity: 0.38,
          letterSpacing: '0.08em',
        }}>
          Twelve years of glory, heartbreak, and bad trades.
        </p>
        <div style={{
          width: '80px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)',
          margin: '1.5rem auto 0',
        }} />
      </motion.div>

      {/* ── Summary chips ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}
      >
        <StatChip value={seasons.length} label="Seasons" />
        <StatChip value={inauguralYear}  label="Founded" />
        <StatChip value="ESPN → Sleeper" label="Platforms" />
        <StatChip value={sleeperRows.length} label="Sleeper Seasons" />
      </motion.div>

      {/* ── Sleeper era ──────────────────────────────────────────── */}
      <EraHeading
        label="Sleeper"
        range={sleeperRange}
        count={sleeperRows.length}
        color="#7ee8a2"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {sleeperRows.map((season, i) => (
          <SeasonRow key={season.year} season={season} index={i} />
        ))}
      </div>

      {/* ── ESPN era ─────────────────────────────────────────────── */}
      <EraHeading
        label="ESPN"
        range={espnRange}
        count={espnRows.length}
        color="#c5a3ff"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {espnRows.map((season, i) => (
          <SeasonRow key={season.year} season={season} index={sleeperRows.length + i} />
        ))}
      </div>

    </div>
  )
}
