import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PokeCard from '../components/cards/PokeCard'
import PodcastBar from '../components/ui/PodcastBar'
import members from '../data/members'

/* ─────────────────────────────────────────────────────────────────
   SITE CONFIG — update each season here, nothing else needs changing
   ───────────────────────────────────────────────────────────────── */
const siteConfig = {
  currentChampion: {
    memberId:   'joe',
    record:     '11–3',
    points:     '1741',
    titles:     2,
    streak:     'Back-to-Back',
    flavorText: 'Back-to-back champion. The waiver wire is his personal grocery store.',
    cardNumber: '001',
  },
  currentLoser: {
    memberId:   'kenley',
    record:     '4–10',
    points:     '1584',
    titles:     1,
    streak:     'Toilet Bowl',
    flavorText: 'Dangerous come December — just not this December.',
    cardNumber: '010',
  },
  currentSeason: '2025',
  latestPodcast: {
    title:    'Ep. 42 — Week 13 Recap & Playoff Preview',
    duration: '58 min',
    episode:  42,
  },
  nextEvent: {
    month:       'Mar',
    day:         '08',
    year:        '2026',
    title:       '2025 Draft Day',
    description: 'Annual live draft — all 10 managers online. Snake format, 15 rounds. Trash talk mandatory.',
    tag:         'Draft',
  },
}

const CURRENT_BOOK = {
  title:    'Flashlight',
  author:   'Susan Choi',
  selector: 'Mike',
  link:     'https://www.goodreads.com/search?q=Flashlight+Susan+Choi',
}

/* ─── Nav tiles ──────────────────────────────────────────────────── */
const NAV_TILES = [
  { icon: '📜', label: 'Archive',     to: '/archive',    desc: 'Season history'  },
  { icon: '👤', label: 'Member Bios', to: '/bios',       desc: 'All managers'    },
  { icon: '📅', label: 'Calendar',    to: '/calendar',   desc: 'Key dates'       },
  { icon: '🎙', label: 'Podcasts',    to: '/podcasts',   desc: 'Weekly pod'      },
  { icon: '📚', label: 'Book Club',   to: '/book-club',  desc: 'Current reads'   },
]

/* ─── Framer Motion variants ─────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function NextEventCard({ event }) {
  const [hovered, setHovered] = useState(false)
  const { month, day, year, title, description, tag } = event

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'flex-start',
        padding: '1.5rem',
        border: `1px solid ${hovered ? 'rgba(200,168,75,0.55)' : 'rgba(200,168,75,0.18)'}`,
        borderRadius: 'var(--card-radius)',
        background: 'rgba(107,26,42,0.07)',
        transition: 'border-color 0.25s ease',
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
        minWidth: '70px',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.8,
        }}>
          {month}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.9rem',
          color: 'var(--gold)',
          lineHeight: 1,
          margin: '3px 0 1px',
        }}>
          {day}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6rem',
          color: 'var(--cream)',
          opacity: 0.4,
        }}>
          {year}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.58rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--maroon-light)',
            border: '1px solid var(--maroon-light)',
            borderRadius: '4px',
            padding: '2px 8px',
          }}>
            {tag}
          </span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.05rem',
          color: 'var(--gold-light)',
          marginBottom: '0.4rem',
          lineHeight: 1.3,
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--cream)',
          opacity: 0.62,
          lineHeight: 1.55,
          marginBottom: '0.85rem',
        }}>
          {description}
        </p>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          color: 'var(--gold)',
          opacity: hovered ? 0.85 : 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: hovered ? '8px' : '5px',
          transition: 'gap 0.2s ease, opacity 0.2s ease',
        }}>
          Add to Calendar
          <span style={{
            display: 'inline-block',
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            transition: 'transform 0.2s ease',
          }}>
            →
          </span>
        </div>
      </div>
    </div>
  )
}

function NavTile({ icon, label, to, desc }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '1.75rem 1rem',
        border: `1px solid ${hovered ? 'rgba(200,168,75,0.45)' : 'rgba(200,168,75,0.13)'}`,
        borderRadius: 'var(--card-radius)',
        background: hovered ? 'rgba(200,168,75,0.04)' : 'rgba(13,5,8,0.55)',
        textDecoration: 'none',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 28px rgba(200,168,75,0.1)' : 'none',
        transition: 'all 0.22s ease',
      }}
    >
      <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{icon}</span>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.78rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: hovered ? 'var(--gold)' : 'var(--cream)',
        opacity: hovered ? 1 : 0.72,
        transition: 'color 0.22s ease, opacity 0.22s ease',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.68rem',
        color: 'var(--cream)',
        opacity: 0.32,
      }}>
        {desc}
      </span>
    </Link>
  )
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function Home() {
  const champion = members.find(m => m.id === siteConfig.currentChampion.memberId)
  const loser    = members.find(m => m.id === siteConfig.currentLoser.memberId)
  const { currentChampion: champ, currentLoser: loserCfg, currentSeason, latestPodcast, nextEvent } = siteConfig

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section style={{
        textAlign: 'center',
        padding: 'clamp(5rem, 12vw, 9rem) 2rem 5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(107,26,42,0.55) 0%, transparent 65%)',
      }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
        >
          {/* Season badge */}
          <motion.div variants={fadeUp}>
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              border: '1px solid rgba(200,168,75,0.32)',
              borderRadius: '999px',
              padding: '5px 18px',
              background: 'rgba(200,168,75,0.05)',
            }}>
              ⚡ {currentSeason} Season
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.25rem, 7vw, 4.5rem)',
            color: 'var(--gold)',
            textShadow: '0 0 40px rgba(200,168,75,0.45), 0 0 80px rgba(200,168,75,0.18)',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Colgate Diaspora
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp} style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.82rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--cream)',
            opacity: 0.32,
            margin: 0,
          }}>
            Fantasy Football · Played Since 2013
          </motion.p>
        </motion.div>
      </section>

      {/* ── 2. Champion + Loser Cards ───────────────────────────── */}
      <section style={{ padding: '0 2rem 5rem' }}>
        <div style={{
          display: 'flex',
          gap: '3rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
          {/* Champion */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: 'easeOut' }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              opacity: 0.75,
              marginBottom: '0.75rem',
            }}>
              🏆 Current Champion
            </div>
            <PokeCard
              variant="champion"
              name={champion?.name}
              role={champion?.role}
              photo={champion?.photo}
              flavorText={champ.flavorText}
              record={champ.record}
              stats={[
                { label: 'Points', value: champ.points },
                { label: 'Titles', value: String(champ.titles) },
                { label: 'Streak', value: champ.streak },
              ]}
              cardNumber={champ.cardNumber}
              season={currentSeason}
            />
          </motion.div>

          {/* Loser */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6, ease: 'easeOut' }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#666',
              marginBottom: '0.75rem',
            }}>
              💀 Current Loser
            </div>
            <PokeCard
              variant="loser"
              name={loser?.name}
              role={loser?.role}
              photo={loser?.photo}
              flavorText={loserCfg.flavorText}
              record={loserCfg.record}
              stats={[
                { label: 'Points', value: loserCfg.points },
                { label: 'Titles', value: String(loserCfg.titles) },
                { label: 'Streak', value: loserCfg.streak },
              ]}
              cardNumber={loserCfg.cardNumber}
              season={currentSeason}
            />
          </motion.div>
        </div>
      </section>

      {/* ── 3. Podcast Bar (full width) ─────────────────────────── */}
      <PodcastBar
        featured
        episode={{ title: latestPodcast.title, duration: latestPodcast.duration }}
      />

      {/* ── 4. Book Club ────────────────────────────────────────── */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.68rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.7,
            whiteSpace: 'nowrap',
          }}>
            📚 Book Club
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(200,168,75,0.35), transparent)',
          }} />
        </div>

        <Link
          to="/book-club"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            border: '1px solid rgba(200,168,75,0.22)',
            borderRadius: 'var(--card-radius)',
            background: 'rgba(107,26,42,0.07)',
            textDecoration: 'none',
            transition: 'border-color 0.25s ease, background 0.25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(200,168,75,0.5)'
            e.currentTarget.style.background = 'rgba(107,26,42,0.14)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(200,168,75,0.22)'
            e.currentTarget.style.background = 'rgba(107,26,42,0.07)'
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.58rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              opacity: 0.55,
              marginBottom: '0.3rem',
            }}>
              Currently Reading
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--gold)',
              lineHeight: 1.2,
            }}>
              {CURRENT_BOOK.title}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--cream)',
              opacity: 0.45,
              marginTop: '0.2rem',
            }}>
              {CURRENT_BOOK.author} · Selected by {CURRENT_BOOK.selector}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.68rem',
            letterSpacing: '0.1em',
            color: 'var(--gold)',
            opacity: 0.5,
            flexShrink: 0,
          }}>
            →
          </div>
        </Link>
      </section>

      {/* ── 5. Next Event ───────────────────────────────────────── */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        {/* Heading with extending gold line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.68rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.7,
            whiteSpace: 'nowrap',
          }}>
            📅 Next Event
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(200,168,75,0.35), transparent)',
          }} />
        </div>

        <NextEventCard event={nextEvent} />
      </section>

      {/* ── 6. Nav Tiles ────────────────────────────────────────── */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
          gap: '0.875rem',
        }}>
          {NAV_TILES.map(tile => (
            <NavTile key={tile.to} {...tile} />
          ))}
        </div>
      </section>

    </div>
  )
}
