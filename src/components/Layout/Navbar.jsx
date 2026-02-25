import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const navLinks = [
  { to: '/archive',    label: 'Archive'    },
  { to: '/bios',       label: 'Bios'       },
  { to: '/calendar',   label: 'Calendar'   },
  { to: '/podcasts',   label: 'Podcasts'   },
  { to: '/book-club',  label: 'Book Club'  },
]

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        background: 'rgba(13, 5, 8, 0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(200, 168, 75, 0.15)',
      }}
    >
      {/* Left: Logo + Tagline */}
      <Link to="/" style={{ textDecoration: 'none', lineHeight: 1.2 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.05rem',
          color: 'var(--gold)',
          letterSpacing: '0.04em',
          textShadow: '0 0 18px rgba(200,168,75,0.35)',
        }}>
          Colgate Diaspora
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.65rem',
          color: 'var(--cream)',
          opacity: 0.4,
          letterSpacing: '0.08em',
          marginTop: '1px',
        }}>
          Est. 2013 · Fantasy Football
        </div>
      </Link>

      {/* Center: Nav Links */}
      <ul style={{
        display: 'flex',
        gap: '2.25rem',
        listStyle: 'none',
        alignItems: 'center',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        {navLinks.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-serif)',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--gold)' : 'var(--cream)',
                opacity: isActive ? 1 : 0.55,
                transition: 'color 0.25s ease, opacity 0.25s ease',
                textDecoration: 'none',
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.color = 'var(--gold)'
                  e.currentTarget.style.opacity = '1'
                }
              }}
              onMouseLeave={e => {
                const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
                e.currentTarget.style.color = isActive ? 'var(--gold)' : 'var(--cream)'
                e.currentTarget.style.opacity = isActive ? '1' : '0.55'
              }}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right: Pitchfork Easter Egg */}
      <Link
        to="/oh-hell"
        aria-label="Oh Hell"
        style={{
          fontSize: '1.3rem',
          opacity: 0.15,
          transition: 'opacity 0.3s ease, filter 0.3s ease',
          textDecoration: 'none',
          lineHeight: 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.opacity = '0.9'
          e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(200,168,75,0.9))'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '0.15'
          e.currentTarget.style.filter = 'none'
        }}
      >
        ⚡
      </Link>
    </motion.nav>
  )
}
