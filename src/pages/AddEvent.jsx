import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const TYPE_OPTIONS = [
  { value: 'meetup',   label: '🍺 Meetup'    },
  { value: 'draft',    label: '📋 Draft'     },
  { value: 'deadline', label: '⚡ Deadline'  },
  { value: 'playoffs', label: '🏆 Playoffs'  },
  { value: 'other',    label: '🏈 Other'     },
]

const STORAGE_KEY = 'cd_custom_events'

function loadCustomEvents() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function saveCustomEvent(event) {
  const existing = loadCustomEvents()
  const next = [...existing, event]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

/* ── Input wrapper ─────────────────────────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div>
        <label style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.8,
          display: 'block',
          marginBottom: hint ? '0.2rem' : 0,
        }}>
          {label}
        </label>
        {hint && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--cream)',
            opacity: 0.38,
            fontStyle: 'italic',
          }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

const inputBase = {
  width: '100%',
  background: 'rgba(13,5,8,0.7)',
  border: '1px solid rgba(200,168,75,0.28)',
  borderRadius: '8px',
  padding: '11px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  color: 'var(--cream)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function AddEvent() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    date: '',
    type: 'other',
    description: '',
    location: '',
    notes: '',
  })
  const [focused, setFocused] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const borderColor = (key) =>
    focused === key ? 'rgba(200,168,75,0.7)' : 'rgba(200,168,75,0.28)'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return

    const description = [form.description.trim(), form.notes.trim()]
      .filter(Boolean).join('\n\n')

    const newEvent = {
      id: `custom_${Date.now()}`,
      title: form.title.trim(),
      date: form.date,
      type: form.type,
      description: description || null,
      location: form.location.trim() || null,
      addToCalendarLink: null,
    }

    saveCustomEvent(newEvent)
    setSubmitted(true)
    setTimeout(() => navigate('/calendar'), 1200)
  }

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '5rem 2rem 6rem' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '3rem' }}
      >
        <Link
          to="/calendar"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.5,
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '1.5rem',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
        >
          ← Back to Calendar
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          color: 'var(--gold)',
          textShadow: '0 0 30px rgba(200,168,75,0.3)',
          marginBottom: '0.5rem',
        }}>
          Add Event
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.92rem',
          color: 'var(--cream)',
          opacity: 0.38,
          letterSpacing: '0.06em',
        }}>
          Add a new event to the league calendar.
        </p>
        <div style={{
          width: '60px', height: '1px',
          background: 'linear-gradient(90deg, rgba(200,168,75,0.5), transparent)',
          marginTop: '1.25rem',
        }} />
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          padding: '2rem',
          border: '1px solid rgba(200,168,75,0.22)',
          borderRadius: '14px',
          background: 'linear-gradient(160deg, rgba(61,10,20,0.18) 0%, rgba(13,5,8,0.6) 100%)',
        }}
      >

        {/* Event Name */}
        <Field label="Event Name *">
          <input
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Summer Meetup"
            required
            style={{ ...inputBase, borderColor: borderColor('title') }}
          />
        </Field>

        {/* Date + Type row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <Field label="Date *">
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              onFocus={() => setFocused('date')}
              onBlur={() => setFocused(null)}
              required
              style={{
                ...inputBase,
                borderColor: borderColor('date'),
                colorScheme: 'dark',
              }}
            />
          </Field>

          <Field label="Type">
            <select
              value={form.type}
              onChange={e => set('type', e.target.value)}
              onFocus={() => setFocused('type')}
              onBlur={() => setFocused(null)}
              style={{
                ...inputBase,
                borderColor: borderColor('type'),
                cursor: 'pointer',
              }}
            >
              {TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: '#1a0a10' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Location */}
        <Field label="Location">
          <input
            type="text"
            value={form.location}
            onChange={e => set('location', e.target.value)}
            onFocus={() => setFocused('location')}
            onBlur={() => setFocused(null)}
            placeholder="e.g. New York, NY"
            style={{ ...inputBase, borderColor: borderColor('location') }}
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            onFocus={() => setFocused('description')}
            onBlur={() => setFocused(null)}
            placeholder="What's happening at this event?"
            rows={3}
            style={{
              ...inputBase,
              resize: 'vertical',
              minHeight: '80px',
              borderColor: borderColor('description'),
            }}
          />
        </Field>

        {/* Notes */}
        <Field label="Notes" hint="Include website, zoom link, etc.">
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            onFocus={() => setFocused('notes')}
            onBlur={() => setFocused(null)}
            placeholder="https://zoom.us/j/..."
            rows={3}
            style={{
              ...inputBase,
              resize: 'vertical',
              minHeight: '80px',
              borderColor: borderColor('notes'),
            }}
          />
        </Field>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitted}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: submitted ? 'rgba(200,168,75,0.6)' : 'var(--gold)',
              background: submitted ? 'rgba(200,168,75,0.1)' : 'rgba(200,168,75,0.12)',
              border: `1px solid ${submitted ? 'rgba(200,168,75,0.3)' : 'rgba(200,168,75,0.55)'}`,
              borderRadius: '24px',
              padding: '10px 28px',
              cursor: submitted ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              if (!submitted) e.currentTarget.style.background = 'rgba(200,168,75,0.22)'
            }}
            onMouseLeave={e => {
              if (!submitted) e.currentTarget.style.background = 'rgba(200,168,75,0.12)'
            }}
          >
            {submitted ? '✓ Event Added' : 'Add to Calendar'}
          </button>
        </div>

      </motion.form>
    </div>
  )
}
