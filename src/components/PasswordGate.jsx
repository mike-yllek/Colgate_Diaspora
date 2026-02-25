import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PASSWORD    = 'Colgate2012'
const STORAGE_KEY = 'cd_auth_v1'

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  )
  const [input,   setInput]   = useState('')
  const [error,   setError]   = useState(false)
  const [shaking, setShaking] = useState(false)

  if (unlocked) return children

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true')
      setUnlocked(true)
    } else {
      setError(true)
      setShaking(true)
      setInput('')
      setTimeout(() => setError(false),   3000)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(107,26,42,0.55) 0%, rgba(13,5,8,1) 65%)',
      padding: '2rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
            color: 'var(--gold)',
            textShadow: '0 0 40px rgba(200,168,75,0.45)',
            marginBottom: '0.4rem',
          }}>
            Colgate Diaspora
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.62rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--cream)',
            opacity: 0.32,
          }}>
            Members Only
          </div>
        </div>

        {/* Card */}
        <motion.div
          animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            border: `1px solid ${error ? 'rgba(200,80,80,0.5)' : 'rgba(200,168,75,0.25)'}`,
            borderRadius: '16px',
            padding: '2.25rem',
            background: 'rgba(13,5,8,0.88)',
            backdropFilter: 'blur(20px)',
            transition: 'border-color 0.3s ease',
          }}
        >
          <div style={{
            fontSize: '2rem',
            marginBottom: '1.25rem',
            filter: 'drop-shadow(0 0 12px rgba(200,168,75,0.5))',
          }}>
            ⚡
          </div>

          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.65,
            marginBottom: '1.75rem',
          }}>
            Enter the password
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <input
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Password"
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${error ? 'rgba(200,80,80,0.5)' : 'rgba(200,168,75,0.22)'}`,
                borderRadius: '8px',
                color: 'var(--cream)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                letterSpacing: '0.18em',
                outline: 'none',
                textAlign: 'center',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => {
                if (!error) e.target.style.borderColor = 'rgba(200,168,75,0.55)'
              }}
              onBlur={e => {
                if (!error) e.target.style.borderColor = 'rgba(200,168,75,0.22)'
              }}
            />

            <button
              type="submit"
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--gold)',
                background: 'var(--maroon)',
                color: 'var(--gold)',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--maroon-light)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--maroon)'}
            >
              Enter
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'rgba(200,80,80,0.85)',
                  marginTop: '0.85rem',
                  marginBottom: 0,
                }}
              >
                Incorrect password. Try again.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.65rem',
          color: 'var(--cream)',
          opacity: 0.18,
          marginTop: '1.5rem',
        }}>
          Est. 2013 · Fantasy Football
        </p>
      </motion.div>
    </div>
  )
}
