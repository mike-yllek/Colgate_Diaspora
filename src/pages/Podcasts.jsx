/*
 * ─────────────────────────────────────────────────────────────────────────
 * PODCAST SETUP
 * When you have a hosting platform, update PODCAST_CONFIG below.
 *
 *   For Spotify embed:
 *     platform: 'spotify'
 *     embedUrl: 'https://open.spotify.com/embed/show/YOUR_SHOW_ID'
 *     (renders an <iframe> with the Spotify player)
 *
 *   For RSS feed with a player library:
 *     platform: 'rss'
 *     feedUrl: 'https://anchor.fm/s/YOUR_FEED_ID/podcast/rss'
 *     Recommended library: react-h5-audio-player
 *     Install: npm install react-h5-audio-player
 *
 *   For Anchor / Buzzsprout / Podbean:
 *     Each provides an embed code — drop it into the <ComingSoonHero>
 *     component below in place of the placeholder UI.
 *
 * ─────────────────────────────────────────────────────────────────────────
 */
const PODCAST_CONFIG = {
  platform: null,          // 'spotify' | 'rss' | 'anchor' | null (coming soon)
  embedUrl:  null,         // Spotify embed URL
  feedUrl:   null,         // RSS feed URL
  showTitle: 'Colgate Diaspora Football Talk',
  showDesc:  'Weekly fantasy football talk from the Colgate Diaspora league. Predictions, hot takes, trade talk, and post-game chaos.',
  spotifyUrl:       null,  // https://open.spotify.com/show/...
  applePodcastsUrl: null,  // https://podcasts.apple.com/...
  googlePodcastsUrl: null, // https://podcasts.google.com/...
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import PodcastBar from '../components/ui/PodcastBar'

/* ── Placeholder episodes ─────────────────────────────────────────────── */
const EPISODES = [
  {
    id: 1, ep: 5,
    title: '2025 Season Preview — Predictions, Sleepers & Hot Takes',
    date: 'Sep 3, 2025', duration: '1h 12m', season: 2025,
    description: 'We debate our picks for this year\'s champ, bust a few myths, and tell Dave why his team is already cooked.',
  },
  {
    id: 2, ep: 4,
    title: 'Week 6 Recap — The Injury Report',
    date: 'Oct 13, 2025', duration: '48m', season: 2025,
    description: 'Half the league is on a bye. The other half is panicking. Standard fantasy football.',
  },
  {
    id: 3, ep: 3,
    title: 'Mid-Season Power Rankings — Who\'s For Real?',
    date: 'Oct 27, 2025', duration: '55m', season: 2025,
    description: 'Definitive power rankings debate. Spoiler: nobody agrees. Bobby gets roasted.',
  },
  {
    id: 4, ep: 2,
    title: 'Trade Deadline Emergency Pod',
    date: 'Nov 10, 2025', duration: '1h 3m', season: 2025,
    description: 'Last-minute trades, deadline snubs, and the deals we still can\'t believe happened.',
  },
  {
    id: 5, ep: 1,
    title: '2024 Season Wrap-Up & Annual Awards',
    date: 'Jan 8, 2025', duration: '1h 28m', season: 2024,
    description: 'Full season review, trophy ceremony, and the traditional Toilet Bowl eulogy. Tears were shed.',
  },
  {
    id: 6, ep: 0,
    title: 'Pilot — Why We Built This League',
    date: 'Sep 1, 2024', duration: '34m', season: 2024,
    description: 'The origin story. Mike explains how it all started in 2013. Nobody believed it would last. Look at us now.',
  },
]

/* ── Waveform bars (visual only) ──────────────────────────────────────── */
const STATIC_BARS = [0.4, 0.7, 0.55, 0.9, 0.65, 0.8, 0.45, 0.75, 0.6, 0.85, 0.5, 0.7]

function StaticWaveform() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '32px' }}>
      {STATIC_BARS.map((h, i) => (
        <div key={i} style={{
          width: '4px',
          height: `${h * 100}%`,
          background: 'var(--gold)',
          borderRadius: '2px',
          opacity: 0.35,
        }} />
      ))}
    </div>
  )
}

/* ── Subscribe platform button ────────────────────────────────────────── */
function PlatformBtn({ label, icon, color, url }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={url || '#'}
      onClick={e => !url && e.preventDefault()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        border: `1px solid ${hovered ? color : 'rgba(200,168,75,0.18)'}`,
        borderRadius: '8px',
        background: hovered ? `${color}18` : 'rgba(13,5,8,0.5)',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: url ? 'pointer' : 'default',
        opacity: url ? 1 : 0.45,
      }}
    >
      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{icon}</span>
      <div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: hovered ? color : 'var(--cream)',
          transition: 'color 0.2s',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.68rem',
          color: 'var(--cream)',
          opacity: 0.35,
          marginTop: '1px',
        }}>
          {url ? 'Subscribe' : 'Coming soon'}
        </div>
      </div>
    </a>
  )
}

/* ── Coming soon hero ─────────────────────────────────────────────────── */
function ComingSoonHero() {
  return (
    <div style={{
      border: '1px solid rgba(200,168,75,0.2)',
      borderRadius: 'var(--card-radius)',
      background: 'linear-gradient(160deg, rgba(61,10,20,0.6) 0%, rgba(13,5,8,0.8) 100%)',
      overflow: 'hidden',
      marginBottom: '3.5rem',
    }}>
      {/* Top banner */}
      <div style={{
        background: 'rgba(200,168,75,0.06)',
        borderBottom: '1px solid rgba(200,168,75,0.12)',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.55rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.6,
        }}>
          🎙 Colgate Diaspora Football Talk
        </span>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.5rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          background: 'rgba(200,168,75,0.15)',
          border: '1px solid rgba(200,168,75,0.35)',
          borderRadius: '3px',
          padding: '1px 6px',
          marginLeft: 'auto',
        }}>
          Coming Soon
        </span>
      </div>

      {/* Main body */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        padding: '2rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {/* Artwork placeholder */}
        <div style={{
          width: '120px',
          height: '120px',
          flexShrink: 0,
          background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
          border: '1px solid rgba(200,168,75,0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
        }}>
          🎙
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 3vw, 1.35rem)',
            color: 'var(--gold-light)',
            marginBottom: '0.5rem',
            lineHeight: 1.2,
          }}>
            Colgate Diaspora<br />Football Talk
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            color: 'var(--cream)',
            opacity: 0.55,
            lineHeight: 1.5,
            marginBottom: '1.25rem',
          }}>
            The pod is coming. Weekly fantasy football talk — predictions, hot takes, trade drama, and post-game chaos from the Colgate Diaspora league.
          </p>

          {/* Fake player UI */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(200,168,75,0.1)',
            borderRadius: '8px',
            padding: '14px 16px',
          }}>
            {/* Episode title placeholder */}
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.72rem',
              color: 'var(--cream)',
              opacity: 0.4,
              marginBottom: '12px',
              fontStyle: 'italic',
            }}>
              No episodes yet — subscribe to be notified
            </div>

            {/* Fake controls row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Fake play button */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(200,168,75,0.12)',
                border: '1px solid rgba(200,168,75,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(200,168,75,0.4)', fontSize: '0.8rem',
                flexShrink: 0,
              }}>
                ▶
              </div>

              {/* Fake seek bar */}
              <div style={{ flex: 1 }}>
                <div style={{
                  height: '3px', borderRadius: '2px',
                  background: 'rgba(255,255,255,0.08)',
                  marginBottom: '6px',
                  overflow: 'hidden',
                }}>
                  <div style={{ width: '0%', height: '100%', background: 'rgba(200,168,75,0.3)', borderRadius: '2px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'rgba(245,240,232,0.2)' }}>0:00</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'rgba(245,240,232,0.2)' }}>—:——</span>
                </div>
              </div>

              <StaticWaveform />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Season tag chip ─────────────────────────────────────────────────── */
function SeasonTag({ season }) {
  return (
    <span style={{
      fontFamily: 'var(--font-serif)',
      fontSize: '0.5rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(200,168,75,0.6)',
      background: 'rgba(200,168,75,0.08)',
      border: '1px solid rgba(200,168,75,0.2)',
      borderRadius: '3px',
      padding: '1px 6px',
      flexShrink: 0,
    }}>
      {season}
    </span>
  )
}

/* ── Enhanced episode card ────────────────────────────────────────────── */
function EpisodeCard({ episode, index }) {
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        border: `1px solid ${hovered ? 'rgba(200,168,75,0.45)' : 'rgba(200,168,75,0.15)'}`,
        borderRadius: 'var(--card-radius)',
        background: hovered ? 'rgba(107,26,42,0.12)' : 'rgba(13,5,8,0.55)',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      {/* Play button */}
      <button
        onClick={() => setPlaying(p => !p)}
        style={{
          width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
          background: playing ? 'var(--gold)' : 'linear-gradient(135deg, var(--maroon), var(--maroon-light))',
          border: `2px solid ${playing ? 'var(--gold)' : 'rgba(200,168,75,0.45)'}`,
          color: playing ? 'var(--dark)' : 'var(--gold)',
          fontSize: '0.88rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {playing ? '⏸' : '▶'}
      </button>

      {/* Episode number */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        color: 'var(--gold)',
        opacity: 0.18,
        minWidth: '28px',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        {episode.ep}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.95rem',
            color: 'var(--gold-light)',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
          }}>
            {episode.title}
          </h3>
          <SeasonTag season={episode.season} />
        </div>
        {episode.description && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            color: 'var(--cream)',
            opacity: 0.5,
            marginBottom: '4px',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {episode.description}
          </p>
        )}
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.65rem',
          letterSpacing: '0.08em',
          color: 'var(--gold)',
          opacity: 0.38,
        }}>
          {[episode.date, episode.duration].filter(Boolean).join(' · ')}
        </span>
      </div>
    </motion.div>
  )
}

/* ── Section label with rule ──────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.68rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        opacity: 0.7,
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(200,168,75,0.28), transparent)' }} />
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function Podcasts() {
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '5rem 2rem 6rem' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3.25rem)',
          color: 'var(--gold)',
          textShadow: '0 0 30px rgba(200,168,75,0.35)',
          marginBottom: '0.5rem',
        }}>
          The Podcast
        </h1>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.78rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--cream)',
          opacity: 0.32,
        }}>
          Colgate Diaspora Football Talk
        </p>
        <div style={{
          width: '80px', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)',
          margin: '1.5rem auto 0',
        }} />
      </motion.div>

      {/* ── Coming soon hero ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <ComingSoonHero />
      </motion.div>

      {/* ── Subscribe row ────────────────────────────────────────── */}
      <section style={{ marginBottom: '3.5rem' }}>
        <SectionLabel>📻 Subscribe</SectionLabel>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <PlatformBtn
            label="Spotify"
            icon="🎵"
            color="#1DB954"
            url={PODCAST_CONFIG.spotifyUrl}
          />
          <PlatformBtn
            label="Apple Podcasts"
            icon="🎙"
            color="#FC3C44"
            url={PODCAST_CONFIG.applePodcastsUrl}
          />
          <PlatformBtn
            label="Google Podcasts"
            icon="🎧"
            color="#4285F4"
            url={PODCAST_CONFIG.googlePodcastsUrl}
          />
        </div>
      </section>

      {/* ── Episode list ─────────────────────────────────────────── */}
      <section>
        <SectionLabel>🎙 Episodes</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {EPISODES.map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} />
          ))}
        </div>
      </section>

    </div>
  )
}
