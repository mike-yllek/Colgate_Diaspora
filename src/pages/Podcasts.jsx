import { motion } from 'framer-motion'

/* ── One template episode (example only) ─────────────────────────────── */
const EXAMPLE_EPISODE = {
  ep: 1,
  title: 'Ep. 1 — Season Preview: Predictions, Sleepers & Hot Takes',
  date: 'Coming Soon',
  duration: '~1 hr',
  description: 'We debate our picks for this year\'s champion, bust a few myths, and tell someone why their team is already cooked.',
}

/* ── Waveform bars (visual only) ──────────────────────────────────────── */
const STATIC_BARS = [0.4, 0.7, 0.55, 0.9, 0.65, 0.8, 0.45, 0.75, 0.6, 0.85, 0.5, 0.7]

function StaticWaveform() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '28px' }}>
      {STATIC_BARS.map((h, i) => (
        <div key={i} style={{
          width: '4px',
          height: `${h * 100}%`,
          background: 'var(--gold)',
          borderRadius: '2px',
          opacity: 0.2,
        }} />
      ))}
    </div>
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

      {/* ── Under Construction notice ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        style={{ marginBottom: '3.5rem' }}
      >
        <div style={{
          border: '1px solid rgba(200,168,75,0.28)',
          borderRadius: 'var(--card-radius)',
          background: 'linear-gradient(160deg, rgba(61,10,20,0.35) 0%, rgba(13,5,8,0.7) 100%)',
          overflow: 'hidden',
        }}>
          {/* Construction banner */}
          <div style={{
            background: 'rgba(200,168,75,0.13)',
            borderBottom: '1px solid rgba(200,168,75,0.3)',
            padding: '10px 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>🚧</span>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>
              Under Construction
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(200,168,75,0.3), transparent)' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.72rem',
              color: 'var(--cream)',
              opacity: 0.5,
              fontStyle: 'italic',
            }}>
              Coming soon
            </span>
          </div>

          {/* Body */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            padding: '2rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            {/* Artwork placeholder */}
            <div style={{
              width: '110px',
              height: '110px',
              flexShrink: 0,
              background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
              border: '1px solid rgba(200,168,75,0.18)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.75rem',
            }}>
              🎙
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 3vw, 1.3rem)',
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
                lineHeight: 1.55,
                marginBottom: '1rem',
              }}>
                The pod is in the works. Weekly fantasy football talk — predictions, hot takes, trade drama, and post-game chaos from the Colgate Diaspora league.
              </p>
              <StaticWaveform />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Example episode ──────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <SectionLabel>🎙 Episodes</SectionLabel>

        {/* Example card */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: 'var(--card-radius)',
          background: 'rgba(13,5,8,0.55)',
          opacity: 0.65,
          position: 'relative',
        }}>
          {/* Example badge */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '1rem',
            background: 'rgba(13,5,8,0.9)',
            border: '1px solid rgba(200,168,75,0.3)',
            borderRadius: '3px',
            padding: '2px 10px',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.5rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.6,
          }}>
            Example
          </div>

          {/* Fake play button */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--maroon), var(--maroon-light))',
            border: '2px solid rgba(200,168,75,0.3)',
            color: 'rgba(200,168,75,0.4)',
            fontSize: '0.88rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            ▶
          </div>

          {/* Episode number */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: 'var(--gold)',
            opacity: 0.15,
            minWidth: '28px',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            {EXAMPLE_EPISODE.ep}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.95rem',
              color: 'var(--gold-light)',
              lineHeight: 1.3,
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {EXAMPLE_EPISODE.title}
            </h3>
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
              {EXAMPLE_EPISODE.description}
            </p>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              color: 'var(--gold)',
              opacity: 0.38,
            }}>
              {EXAMPLE_EPISODE.date} · {EXAMPLE_EPISODE.duration}
            </span>
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--cream)',
          opacity: 0.28,
          fontStyle: 'italic',
          textAlign: 'center',
          marginTop: '1.25rem',
        }}>
          Episodes will appear here once the podcast launches.
        </p>
      </motion.section>

    </div>
  )
}
