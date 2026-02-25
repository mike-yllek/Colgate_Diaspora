import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SEASONS, OVERALL, POWER, getChampion, getToilet, toiletCounts } from '../data/archiveData'

/* ── Helpers ──────────────────────────────────────────────────────────── */
const SEASON_YEARS = Object.keys(SEASONS).sort((a, b) => b - a)
const worstToiletEntry = Object.entries(toiletCounts).sort((a, b) => b[1] - a[1])[0]

/* ── Unique champions ────────────────────────────────────────────────── */
const uniqueChamps = new Set(Object.keys(SEASONS).map(getChampion)).size

/* ── Adjusted power rankings with -10% toilet penalty ───────────────── */
const maxToilets = Math.max(...Object.values(toiletCounts), 1)
const ADJUSTED_POWER = (() => {
  const scored = POWER.map(p => {
    const tc      = toiletCounts[p.team] || 0
    const penalty = 0.1 * (tc / maxToilets)
    return { ...p, toilets: tc, adjustedScore: p.power - penalty }
  }).sort((a, b) => b.adjustedScore - a.adjustedScore)
  const maxScore = scored[0].adjustedScore
  return scored.map((p, i) => ({
    ...p,
    rank:           i + 1,
    normalizedScore: p.adjustedScore / maxScore,
  }))
})()

/* ── Sub-components ───────────────────────────────────────────────────── */

function StatBadge({ value, label }) {
  return (
    <div style={{
      background: 'rgba(107,26,42,0.3)',
      border: '1px solid rgba(200,168,75,0.22)',
      borderRadius: 'var(--card-radius)',
      padding: '14px 20px',
      textAlign: 'center',
      minWidth: '120px',
      flex: '1 1 120px',
    }}>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.5rem',
        color: 'var(--gold-light)',
        lineHeight: 1,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.62rem',
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

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '10px 24px',
        background: 'none',
        border: 'none',
        borderBottom: `2px solid ${active ? 'var(--gold)' : 'transparent'}`,
        color: active ? 'var(--gold)' : 'rgba(245,240,232,0.35)',
        cursor: 'pointer',
        marginBottom: '-1px',
        transition: 'color 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

/* ── Champion strip (scrollable year chips) ──────────────────────────── */
function ChampStrip({ selected, onSelect }) {
  return (
    <div style={{ overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
        {SEASON_YEARS.map(year => {
          const champ = getChampion(year)
          const isActive = year === selected
          return (
            <button
              key={year}
              onClick={() => onSelect(year)}
              style={{
                background: isActive ? 'rgba(107,26,42,0.6)' : 'rgba(107,26,42,0.25)',
                border: `1px solid ${isActive ? 'var(--gold)' : 'rgba(200,168,75,0.18)'}`,
                borderRadius: '8px',
                padding: '10px 14px',
                textAlign: 'center',
                minWidth: '88px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                color: isActive ? 'var(--gold)' : 'rgba(200,168,75,0.55)',
                marginBottom: '4px',
              }}>
                {year}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.72rem',
                color: isActive ? 'var(--gold-light)' : 'rgba(245,240,232,0.55)',
              }}>
                {champ}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Season year pills ───────────────────────────────────────────────── */
function SeasonPills({ selected, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.65rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        opacity: 0.6,
        marginRight: '4px',
      }}>
        Season:
      </span>
      {SEASON_YEARS.map(year => {
        const isActive = year === selected
        return (
          <SeasonPill key={year} year={year} active={isActive} onClick={() => onSelect(year)} />
        )
      })}
    </div>
  )
}

function SeasonPill({ year, active, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.78rem',
        fontWeight: 600,
        padding: '4px 12px',
        background: active ? 'rgba(107,26,42,0.6)' : hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? 'var(--gold)' : hov ? 'rgba(200,168,75,0.38)' : 'rgba(200,168,75,0.14)'}`,
        color: active ? 'var(--gold)' : hov ? 'var(--cream)' : 'rgba(245,240,232,0.4)',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {year}
    </button>
  )
}

/* ── Status badge ────────────────────────────────────────────────────── */
function StatusBadge({ type }) {
  if (type === 'champion') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: 'var(--font-serif)', fontSize: '0.68rem',
      color: 'var(--gold-light)',
      background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.3)',
      padding: '2px 9px', borderRadius: '3px',
    }}>
      🏆 Champion
    </span>
  )
  if (type === 'toilet') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: 'var(--font-serif)', fontSize: '0.68rem',
      color: 'rgba(180,100,100,0.8)',
      background: 'rgba(180,60,60,0.08)', border: '1px solid rgba(180,60,60,0.2)',
      padding: '2px 9px', borderRadius: '3px',
    }}>
      🚽 Toilet Bowl
    </span>
  )
  if (type === 'playoff') return (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)', opacity: 0.65 }}>
      Playoffs <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(200,168,75,0.55)', verticalAlign: 'middle', marginLeft: '3px' }} />
    </span>
  )
  return <span style={{ color: 'rgba(245,240,232,0.2)', fontFamily: 'var(--font-body)' }}>—</span>
}

/* ── Table wrapper ───────────────────────────────────────────────────── */
const TH = ({ children, right }) => (
  <th style={{
    fontFamily: 'var(--font-serif)', fontSize: '0.62rem', letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'var(--gold)', padding: '10px 14px',
    borderBottom: '2px solid rgba(200,168,75,0.28)', textAlign: right ? 'right' : 'left',
    whiteSpace: 'nowrap',
  }}>
    {children}
  </th>
)

const TD = ({ children, right, gold, faded, style: extra }) => (
  <td style={{
    padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    borderBottom: '1px solid rgba(245,240,232,0.05)',
    textAlign: right ? 'right' : 'left',
    color: gold ? 'var(--gold)' : faded ? 'rgba(245,240,232,0.3)' : 'var(--cream)',
    ...extra,
  }}>
    {children}
  </td>
)

/* ── Season tab ──────────────────────────────────────────────────────── */
function SeasonTab({ year, onYearChange }) {
  const rows = SEASONS[year]
  const toiletTeam = getToilet(year)

  return (
    <>
      <SectionLabel>🏆 Champions by Year</SectionLabel>
      <ChampStrip selected={year} onSelect={onYearChange} />
      <SeasonPills selected={year} onSelect={onYearChange} />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <TH>Manager</TH>
              <TH right>W</TH>
              <TH right>L</TH>
              <TH right>Win%</TH>
              <TH right>PF</TH>
              <TH right>PA</TH>
              <TH>Status</TH>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const isChamp   = r.championship === 1
              const isToilet  = r.team === toiletTeam && !isChamp
              const isPlayoff = r.playoffs === 1 && !isChamp
              const winPct    = ((r.w / (r.w + r.l)) * 100).toFixed(1)
              const statusType = isChamp ? 'champion' : isToilet ? 'toilet' : isPlayoff ? 'playoff' : 'none'

              return (
                <tr
                  key={r.team}
                  style={{ background: isChamp ? 'rgba(200,168,75,0.06)' : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = isChamp ? 'rgba(200,168,75,0.12)' : 'rgba(107,26,42,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = isChamp ? 'rgba(200,168,75,0.06)' : 'transparent'}
                >
                  <TD style={{ fontFamily: 'var(--font-serif)', color: isChamp ? 'var(--gold-light)' : 'var(--cream)', fontSize: '0.95rem' }}>
                    {r.team}
                  </TD>
                  <TD right gold={isChamp}>{r.w}</TD>
                  <TD right>{r.l}</TD>
                  <TD right>{winPct}%</TD>
                  <TD right>{r.pf.toFixed(1)}</TD>
                  <TD right faded>{r.pa.toFixed(1)}</TD>
                  <TD><StatusBadge type={statusType} /></TD>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ── All-time tab ────────────────────────────────────────────────────── */
function OverallTab() {
  return (
    <>
      <SectionLabel>📋 All-Time Records — All {SEASON_YEARS.length} Seasons</SectionLabel>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <TH>Manager</TH>
              <TH right>Seasons</TH>
              <TH right>W</TH>
              <TH right>L</TH>
              <TH right>Win%</TH>
              <TH right>Playoffs</TH>
              <TH right>Playoff%</TH>
              <TH right>Titles</TH>
              <TH right>Total PF</TH>
            </tr>
          </thead>
          <tbody>
            {OVERALL.map((p, i) => (
              <tr
                key={p.team}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(107,26,42,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <TD style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem' }}>{p.team}</TD>
                <TD right faded>{p.seasons}</TD>
                <TD right>{p.w}</TD>
                <TD right faded>{p.l}</TD>
                <TD right>{p.win_pct}%</TD>
                <TD right>{p.playoffs}</TD>
                <TD right faded>{p.playoff_pct}%</TD>
                <TD right gold>{p.championships}</TD>
                <TD right>{p.total_pf.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ── Power bar ───────────────────────────────────────────────────────── */
function PowerBar({ value }) {
  const pct = (value * 100).toFixed(1)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--maroon-light), var(--gold))',
          }}
        />
      </div>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem', color: 'var(--gold-light)', minWidth: '36px', textAlign: 'right' }}>
        {pct}
      </span>
    </div>
  )
}

const MEDALS = ['🥇', '🥈', '🥉']

/* ── Power rankings tab ──────────────────────────────────────────────── */
function PowerTab() {
  return (
    <>
      {/* Legend */}
      <div style={{
        display: 'flex', gap: '16px', flexWrap: 'wrap',
        padding: '12px 16px', marginBottom: '20px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(200,168,75,0.1)', borderRadius: '8px',
      }}>
        {[
          ['+40%', 'Championships',      'var(--gold)'],
          ['+30%', 'Playoff Appearances', 'var(--gold)'],
          ['+20%', 'Win Rate',            'var(--gold)'],
          ['+10%', 'Points Above Avg',    'var(--gold)'],
          ['−10%', 'Toilet Bowls',        'rgba(200,100,100,0.85)'],
        ].map(([pct, label, color]) => (
          <span key={label} style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(245,240,232,0.5)' }}>
            <span style={{ color, fontWeight: 600 }}>{pct}</span> {label}
          </span>
        ))}
      </div>

      <SectionLabel>⚡ Power Rankings — All Time</SectionLabel>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <TH>Rank</TH>
              <TH>Manager</TH>
              <TH right>Champ%</TH>
              <TH right>Playoff%</TH>
              <TH right>Win%</TH>
              <TH right>PF Avg</TH>
              <TH right>🚽</TH>
              <TH>Power Score</TH>
            </tr>
          </thead>
          <tbody>
            {ADJUSTED_POWER.map(p => {
              const pfColor = p.pf_avg >= 0 ? 'var(--gold-light)' : 'rgba(200,100,100,0.8)'
              const pfStr   = `${p.pf_avg > 0 ? '+' : ''}${p.pf_avg}`
              return (
                <tr
                  key={p.team}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(107,26,42,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <TD style={{ textAlign: 'center', fontSize: p.rank <= 3 ? '1.2rem' : '1rem', color: p.rank === 1 ? 'var(--gold)' : p.rank === 2 ? '#C0C0C0' : p.rank === 3 ? '#CD7F32' : 'rgba(245,240,232,0.25)', fontFamily: 'var(--font-serif)' }}>
                    {p.rank <= 3 ? MEDALS[p.rank - 1] : `#${p.rank}`}
                  </TD>
                  <TD style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem' }}>{p.team}</TD>
                  <TD right>{p.champ_pct}%</TD>
                  <TD right faded>{p.playoff_pct}%</TD>
                  <TD right>{p.win_pct}%</TD>
                  <TD right style={{ color: pfColor }}>{pfStr}</TD>
                  <TD right style={{ color: p.toilets > 0 ? 'rgba(200,100,100,0.75)' : 'rgba(245,240,232,0.2)' }}>
                    {p.toilets > 0 ? p.toilets : '—'}
                  </TD>
                  <TD><PowerBar value={p.normalizedScore} /></TD>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ── Section label with gold rule ────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      fontFamily: 'var(--font-serif)', fontSize: '0.65rem',
      letterSpacing: '0.25em', textTransform: 'uppercase',
      color: 'var(--gold)', marginBottom: '16px',
    }}>
      {children}
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(200,168,75,0.3), transparent)' }} />
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function Archive() {
  const [tab, setTab]               = useState('season')
  const [selectedYear, setSelectedYear] = useState(SEASON_YEARS[0]) // most recent

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem 6rem' }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3.25rem)',
          color: 'var(--gold-light)',
          textShadow: '0 0 40px rgba(200,168,75,0.3)',
          marginBottom: '8px',
        }}>
          The Archive
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.1em' }}>
          A record of glory and shame since 2013
        </p>
        <div style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '20px auto 0' }} />
      </motion.div>

      {/* ── Stat badges ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}
      >
        <StatBadge value={SEASON_YEARS.length} label="Seasons" />
        <StatBadge value={uniqueChamps} label="Unique Champions" />
        <StatBadge value={`${worstToiletEntry[1]}×`} label={`${worstToiletEntry[0]}'s Toilets`} />
        <StatBadge value="106" label="Joe's Wins" />
      </motion.div>

      {/* ── Tab bar ───────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(200,168,75,0.15)', marginBottom: '24px', display: 'flex', gap: '4px' }}>
        <TabBtn active={tab === 'season'}  onClick={() => setTab('season')}>📅 By Season</TabBtn>
        <TabBtn active={tab === 'overall'} onClick={() => setTab('overall')}>📊 All-Time</TabBtn>
        <TabBtn active={tab === 'power'}   onClick={() => setTab('power')}>⚡ Power Rankings</TabBtn>
      </div>

      {/* ── Tab panels ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'season'  && <SeasonTab  year={selectedYear} onYearChange={setSelectedYear} />}
          {tab === 'overall' && <OverallTab />}
          {tab === 'power'   && <PowerTab />}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
