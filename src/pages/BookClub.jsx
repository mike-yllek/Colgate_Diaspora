import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const PAST_BOOKS = [
  {
    title:    'Flashlight',
    author:   'Susan Choi',
    selector: 'Mike',
    link:     'https://www.goodreads.com/search?q=Flashlight+Susan+Choi',
    description: null,
  },
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
    link:     'https://www.goodreads.com/book/show/60784549-in-the-lives-of-puppets',
    description: null,
  },
  {
    title:    'No Country for Old Men',
    author:   'Cormac McCarthy',
    selector: 'Joe',
    link:     'https://www.goodreads.com/book/show/23515727-no-country-for-old-men',
    description: null,
  },
  {
    title:    'The Mercy of Gods',
    author:   'James S.A. Corey',
    selector: 'Ben',
    link:     'https://www.goodreads.com/book/show/201930181-the-mercy-of-gods',
    description: null,
  },
  {
    title:    'These Silent Woods',
    author:   'Kimi Cunningham Grant',
    selector: 'Andy',
    link:     'https://www.goodreads.com/book/show/56268973-these-silent-woods',
    description: null,
  },
  {
    title:    'The Winner',
    author:   'Teddy Wayne',
    selector: 'Kiri',
    link:     'https://www.goodreads.com/book/show/198123575-the-winner',
    description: null,
  },
]

const CURRENT_BOOK = {
  title:    'The Splendid and the Vile',
  author:   'Erik Larson',
  selector: 'Kenley',
  year:     2026,
  link:     'https://www.goodreads.com/search?q=The+Splendid+and+the+Vile+Erik+Larson',
  description: null,
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(n => {
        const filled = n <= (hovered || value)
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 : n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              fontSize: '1.4rem',
              color: filled ? 'var(--gold)' : 'rgba(200,168,75,0.2)',
              transition: 'color 0.1s, transform 0.1s',
              transform: hovered === n ? 'scale(1.2)' : 'scale(1)',
              lineHeight: 1,
            }}
          >
            ★
          </button>
        )
      })}
      {value > 0 && (
        <button
          type="button"
          onClick={() => onChange(0)}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px 6px',
            cursor: 'pointer',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            fontFamily: 'var(--font-serif)',
            textTransform: 'uppercase',
            color: 'rgba(200,168,75,0.35)',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(200,168,75,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,168,75,0.35)'}
        >
          Clear
        </button>
      )}
    </div>
  )
}

function RatingBadge({ reviews }) {
  const rated = reviews.filter(r => r.rating > 0)
  if (rated.length === 0) return (
    <span style={{
      fontFamily: 'var(--font-serif)',
      fontSize: '0.65rem',
      letterSpacing: '0.08em',
      color: 'rgba(200,168,75,0.3)',
    }}>
      No ratings yet
    </span>
  )
  const avg = (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1)
  return (
    <span style={{
      fontFamily: 'var(--font-serif)',
      fontSize: '0.78rem',
      color: 'var(--gold)',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      <span style={{ fontSize: '0.9rem' }}>★</span>
      <span style={{ fontWeight: 600 }}>{avg}</span>
      <span style={{ opacity: 0.4, fontSize: '0.65rem' }}>({rated.length})</span>
    </span>
  )
}

function ReviewPanel({ book, reviews, onNewReview }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your name.'); return }
    if (!rating && !comment.trim()) { setError('Add a star rating, a comment, or both.'); return }
    setError('')
    setSubmitting(true)
    const { error: dbErr } = await supabase.from('book_reviews').insert({
      book_title: book.title,
      reviewer_name: name.trim(),
      rating: rating || null,
      comment: comment.trim() || null,
    })
    if (dbErr) {
      setError('Something went wrong. Try again.')
      setSubmitting(false)
      return
    }
    onNewReview()
    setName('')
    setRating(0)
    setComment('')
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

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
        paddingTop: '1.25rem',
      }}>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: reviews.length > 0 ? '1.5rem' : 0 }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.55,
            marginBottom: '0.875rem',
          }}>
            Leave a Review
          </p>

          {/* Name */}
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={40}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,168,75,0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'var(--cream)',
              outline: 'none',
              marginBottom: '0.75rem',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(200,168,75,0.2)'}
          />

          {/* Stars */}
          <div style={{ marginBottom: '0.75rem' }}>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          {/* Comment */}
          <textarea
            placeholder="Write a comment... (optional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            maxLength={500}
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,168,75,0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'var(--cream)',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '0.75rem',
              boxSizing: 'border-box',
              lineHeight: 1.5,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(200,168,75,0.2)'}
          />

          {error && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: '#e07070',
              marginBottom: '0.5rem',
            }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: submitting ? 'rgba(200,168,75,0.4)' : 'var(--gold)',
                background: 'transparent',
                border: '1px solid rgba(200,168,75,0.38)',
                borderRadius: '20px',
                padding: '6px 18px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = 'rgba(200,168,75,0.1)' }}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
            <AnimatePresence>
              {submitted && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.7rem',
                    color: 'rgba(200,168,75,0.7)',
                  }}
                >
                  ✓ Posted!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* Existing reviews */}
        {reviews.length > 0 && (
          <div style={{
            borderTop: '1px solid rgba(200,168,75,0.1)',
            paddingTop: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              opacity: 0.45,
              marginBottom: '0.25rem',
            }}>
              Reviews
            </p>
            {reviews.map(r => (
              <div key={r.id} style={{
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                border: '1px solid rgba(200,168,75,0.1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: r.comment ? '6px' : 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.78rem',
                    color: 'var(--gold)',
                    opacity: 0.85,
                  }}>
                    {r.reviewer_name}
                  </span>
                  {r.rating > 0 && (
                    <span style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '1px' }}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                  )}
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.58rem',
                    color: 'rgba(200,168,75,0.3)',
                    marginLeft: 'auto',
                  }}>
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                {r.comment && (
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    color: 'var(--cream)',
                    opacity: 0.65,
                    lineHeight: 1.55,
                    margin: 0,
                  }}>
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function BookCard({ book, isCurrent }) {
  const [reviews, setReviews] = useState([])
  const [showPanel, setShowPanel] = useState(false)

  async function fetchReviews() {
    const { data } = await supabase
      .from('book_reviews')
      .select('*')
      .eq('book_title', book.title)
      .order('created_at', { ascending: false })
    setReviews(data || [])
  }

  useEffect(() => { fetchReviews() }, [book.title])

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

      {/* Rating bar */}
      <div style={{
        borderTop: '1px solid rgba(200,168,75,0.12)',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <RatingBadge reviews={reviews} />
        <button
          onClick={() => setShowPanel(v => !v)}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: showPanel ? 'rgba(200,168,75,0.5)' : 'var(--gold)',
            background: 'transparent',
            border: '1px solid rgba(200,168,75,0.25)',
            borderRadius: '20px',
            padding: '5px 14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,168,75,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {showPanel ? '✕ Close' : '★ Rate & Review'}
        </button>
      </div>

      <AnimatePresence>
        {showPanel && (
          <ReviewPanel book={book} reviews={reviews} onNewReview={fetchReviews} />
        )}
      </AnimatePresence>
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

      {/* Past books */}
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
