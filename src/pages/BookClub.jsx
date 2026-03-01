import { motion } from 'framer-motion'

const PAST_BOOKS = [
  {
    title:    'The Night Circus',
    author:   'Erin Morgenstern',
    selector: 'Dave',
    link:     'https://www.goodreads.com/book/show/9361589-the-night-circus',
    description: null,
  },
  {
    title:    'In the Lives of Puppets',
    author:   'TJ Klune',
    selector: 'Bobby',
    link:     'https://www.goodreads.com/book/show/61884832-in-the-lives-of-puppets',
    description: null,
  },
  {
    title:    'No Country for Old Men',
    author:   'Cormac McCarthy',
    selector: 'Joe',
    link:     'https://www.goodreads.com/book/show/12497.No_Country_for_Old_Men',
    description: null,
  },
  {
    title:    'The Mercy of the Gods',
    author:   'James S.A. Corey',
    selector: 'Ben',
    link:     'https://www.goodreads.com/book/show/199142398-the-mercy-of-the-gods',
    description: null,
  },
  {
    title:    'These Silent Woods',
    author:   'Kimi Cunningham Grant',
    selector: 'Andy',
    link:     'https://www.goodreads.com/book/show/57693700-these-silent-woods',
    description: null,
  },
  {
    title:    'The Winner',
    author:   'Teddy Wayne',
    selector: 'Kiri',
    link:     'https://www.goodreads.com/book/show/199395765-the-winner',
    description: null,
  },
]

const CURRENT_BOOK = {
  title:    'Flashlight',
  author:   'Susan Choi',
  selector: 'Mike',
  year:     2025,
  link:     'https://www.goodreads.com/search?q=Flashlight+Susan+Choi',
  description: 'Selected by Mike for the inaugural Colgate Diaspora Book Club pick.',
}

function BookCard({ book, isCurrent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        border: `1px solid ${isCurrent ? 'rgba(200,168,75,0.45)' : 'rgba(200,168,75,0.18)'}`,
        borderRadius: '14px',
        padding: '2rem',
        background: isCurrent
          ? 'linear-gradient(135deg, rgba(107,26,42,0.18) 0%, rgba(13,5,8,0.7) 100%)'
          : 'rgba(13,5,8,0.55)',
        position: 'relative',
        maxWidth: '560px',
        width: '100%',
      }}
    >
      {isCurrent && (
        <div style={{
          position: 'absolute',
          top: '-11px',
          left: '1.5rem',
          background: 'var(--maroon)',
          border: '1px solid rgba(200,168,75,0.45)',
          borderRadius: '20px',
          padding: '3px 14px',
          fontFamily: 'var(--font-serif)',
          fontSize: '0.58rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
        }}>
          Current Read
        </div>
      )}

      {/* Book info */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          color: 'var(--gold)',
          textShadow: isCurrent ? '0 0 20px rgba(200,168,75,0.3)' : 'none',
          marginBottom: '0.2rem',
          lineHeight: 1.15,
        }}>
          {book.title}
        </h2>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.78rem',
          letterSpacing: '0.1em',
          color: 'var(--cream)',
          opacity: 0.55,
          textTransform: 'uppercase',
        }}>
          by {book.author}
        </p>
      </div>

      {/* Description */}
      {book.description && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--cream)',
          opacity: 0.62,
          lineHeight: 1.6,
          marginBottom: '1.25rem',
        }}>
          {book.description}
        </p>
      )}

      {/* Selector + link row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.5,
          }}>
            Selected by
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            color: 'var(--gold)',
            opacity: 0.9,
          }}>
            {book.selector}
          </span>
        </div>

        <a
          href={book.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.65rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            border: '1px solid rgba(200,168,75,0.38)',
            borderRadius: '20px',
            padding: '5px 16px',
            textDecoration: 'none',
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(200,168,75,0.1)'
            e.currentTarget.style.borderColor = 'rgba(200,168,75,0.65)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(200,168,75,0.38)'
          }}
        >
          View Book →
        </a>
      </div>
    </motion.div>
  )
}

export default function BookClub() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 2rem 6rem' }}>

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
          Book Club
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--cream)',
          opacity: 0.38,
          letterSpacing: '0.08em',
        }}>
          Reading together, scattered across the diaspora.
        </p>
        <div style={{
          width: '80px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)',
          margin: '1.5rem auto 0',
        }} />
      </motion.div>

      {/* Current book section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.68rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.8,
            whiteSpace: 'nowrap',
          }}>
            📚 Current Read
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(200,168,75,0.3), transparent)',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BookCard book={CURRENT_BOOK} isCurrent />
        </div>
      </section>

      {/* Placeholder for past books */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.68rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.45,
            whiteSpace: 'nowrap',
          }}>
            📖 Past Reads
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(200,168,75,0.15), transparent)',
          }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          {PAST_BOOKS.map((book, i) => (
            <motion.div
              key={book.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <BookCard book={book} isCurrent={false} />
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  )
}
