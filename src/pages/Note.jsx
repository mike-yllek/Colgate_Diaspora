import { motion } from 'framer-motion'

export default function Note() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '6rem 2rem 8rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          color: 'var(--gold)',
          textShadow: '0 0 30px rgba(200,168,75,0.3)',
          marginBottom: '3rem',
          letterSpacing: '0.04em',
        }}>
          A Note
        </h1>

        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'var(--cream)',
          opacity: 0.72,
          lineHeight: 1.85,
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          <p>
            This site was built for a private group of friends — for fun, for nostalgia, and for the love of a league that has somehow survived since 2013.
          </p>
          <p>
            All content, including the fantasy character cards, illustrations, and writing, was created with AI assistance and is intended to be wholly original. Member photos are used with the full knowledge of the group. The Pokémon-inspired characters are original creations — custom names, custom art, custom stats — built in the spirit of the game rather than derived from it.
          </p>
          <p>
            If you've found your way here by accident, welcome. If you have any concerns at all about anything on this site, please reach out directly at{' '}
            <a
              href="mailto:mikekelly7347@gmail.com"
              style={{
                color: 'var(--gold)',
                opacity: 0.85,
                textDecoration: 'none',
                borderBottom: '1px solid rgba(200,168,75,0.35)',
                paddingBottom: '1px',
              }}
            >
              mikekelly7347@gmail.com
            </a>
            . We'll sort it out.
          </p>
        </div>

        <div style={{
          marginTop: '3.5rem',
          fontFamily: 'var(--font-serif)',
          fontSize: '0.82rem',
          color: 'var(--gold)',
          opacity: 0.55,
          letterSpacing: '0.08em',
          lineHeight: 1.7,
        }}>
          <p style={{ margin: 0 }}>Made with love, bad trades, and too much free time.</p>
          <p style={{ margin: '0.4rem 0 0' }}>— The Colgate Diaspora, Est. 2013</p>
        </div>
      </motion.div>
    </div>
  )
}
