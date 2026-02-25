import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CardBack from '../../components/cards/CardBack'
import { useOhHell } from '../../hooks/useOhHell'

// ─── How to Play rules ────────────────────────────────────────────
const RULES = [
  {
    title: 'The Basics',
    body: 'Oh Hell! is a trick-taking card game for 3–10 players. Each player bids the exact number of tricks they expect to win in the round. You score points only if your bid is exactly right — overshoot or undershoot and you get nothing.',
  },
  {
    title: 'Round Structure',
    body: 'The game runs in rounds of decreasing then increasing hand sizes. Start at the maximum (floor(52 ÷ players), up to 10 cards), count down to 1, then back up. The full game is a V-shape — total rounds = 2 × max − 1.',
  },
  {
    title: 'Bidding',
    body: 'After dealing, players bid in order starting left of the dealer. The dealer bids last. The total of all bids cannot equal the number of tricks available — the dealer must pick a bid that keeps totals off. This constraint is the great tension of Oh Hell.',
  },
  {
    title: 'Trump Suit',
    body: "After dealing, flip the top remaining card to reveal trump. Trump beats all non-trump cards. You must follow the lead suit if you have it; if you can't follow suit, you may play any card including trump.",
  },
  {
    title: 'Scoring',
    body: 'Hit your bid exactly: earn 10 points plus your bid. Miss by any amount — even one trick — and you score zero for the round. Strategy is about hitting your number, not winning the most tricks.',
  },
  {
    title: 'Winning',
    body: 'After all rounds, the player with the most total points wins. Ties are broken by who scored more points in the final round.',
  },
]

export default function OhHellLobby() {
  // 0: black  1: pitchfork  2: "You found it."  3: subtitle  4: lobby
  const [revealPhase, setRevealPhase] = useState(0)
  const [createName,   setCreateName]   = useState('')
  const [createRoom,   setCreateRoom]   = useState('')
  const [playerCount,  setPlayerCount]  = useState(5)
  const [joinCode,     setJoinCode]     = useState('')
  const [joinName,     setJoinName]     = useState('')
  const [rulesOpen,    setRulesOpen]    = useState(false)
  const [openRule,     setOpenRule]     = useState(null)
  const [loading,      setLoading]      = useState(false)
  const navigate = useNavigate()

  const { createRoom: createRoomFn, joinRoom: joinRoomFn, openRooms, error, isConnected, refreshRooms } = useOhHell()

  // Reveal sequence
  useEffect(() => {
    const ts = [
      setTimeout(() => setRevealPhase(1), 400),
      setTimeout(() => setRevealPhase(2), 1200),
      setTimeout(() => setRevealPhase(3), 2000),
      setTimeout(() => setRevealPhase(4), 2900),
    ]
    return () => ts.forEach(clearTimeout)
  }, [])

  // Refresh room list periodically
  useEffect(() => {
    if (!isConnected) return
    const id = setInterval(refreshRooms, 5000)
    return () => clearInterval(id)
  }, [isConnected, refreshRooms])

  const handleCreate = async () => {
    if (!createName.trim()) return
    setLoading(true)
    try {
      const { roomId } = await createRoomFn(createName.trim(), playerCount)
      navigate(`/oh-hell/${roomId}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (e, code) => {
    e?.preventDefault()
    const roomId = (code || joinCode).trim().toUpperCase()
    const name   = joinName.trim() || createName.trim()
    if (!roomId || !name) return
    setLoading(true)
    try {
      const { roomId: rid } = await joinRoomFn(roomId, name)
      navigate(`/oh-hell/${rid}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(200,168,75,0.35)',
    background: 'rgba(107,26,42,0.1)',
    color: 'var(--cream)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    outline: 'none',
    marginBottom: '1rem',
    transition: 'border-color 0.2s ease',
  }
  const lbl = {
    display: 'block',
    fontFamily: 'var(--font-serif)',
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    opacity: 0.7,
    marginBottom: '0.4rem',
  }
  const panelBtn = (primary) => ({
    width: '100%',
    padding: '0.85rem',
    borderRadius: '8px',
    border: primary ? '1px solid var(--gold)' : '1px solid rgba(200,168,75,0.35)',
    background: primary ? 'var(--maroon)' : 'rgba(200,168,75,0.08)',
    color: primary ? 'var(--gold)' : 'rgba(200,168,75,0.7)',
    fontFamily: 'var(--font-serif)',
    fontSize: '0.8rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    transition: 'all 0.2s ease',
    marginTop: '0.5rem',
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 20%, rgba(61,10,20,0.85) 0%, rgba(13,5,8,1) 65%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient floating card backs */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          opacity: 0.04,
          top:  `${[8,  18, 65, 78, 12, 52, 35, 82][i]}%`,
          left: `${[6,  82, 88, 12, 52, 72, 28, 62][i]}%`,
          transform: `rotate(${[12, -18, 25, -8, 35, -22, 15, -30][i]}deg)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <CardBack size="lg" />
        </div>
      ))}

      {/* ── REVEAL SEQUENCE ──────────────────────────────────── */}
      <AnimatePresence>
        {revealPhase < 4 && (
          <motion.div
            key="reveal"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
            style={{
              position: 'fixed', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 50, gap: '1.5rem',
              background: 'radial-gradient(ellipse at 50% 40%, rgba(61,10,20,0.97) 0%, rgba(13,5,8,0.99) 70%)',
              pointerEvents: 'none',
            }}
          >
            <AnimatePresence>
              {revealPhase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.35 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{ fontSize: 'clamp(4.5rem, 12vw, 7.5rem)', lineHeight: 1,
                    filter: 'drop-shadow(0 0 40px rgba(200,168,75,0.95)) drop-shadow(0 0 90px rgba(200,168,75,0.5))',
                    userSelect: 'none' }}
                >⚡</motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {revealPhase >= 2 && (
                <motion.h1
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65 }}
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
                    color: 'var(--gold)', textShadow: '0 0 50px rgba(200,168,75,0.6)',
                    textAlign: 'center', margin: 0 }}
                >You found it.</motion.h1>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {revealPhase >= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.6, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                    color: 'var(--cream)', textAlign: 'center', maxWidth: '440px',
                    padding: '0 2rem', margin: 0 }}
                >Oh Hell! — The Preferred Card Game of the Colgate Diaspora</motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LOBBY ─────────────────────────────────────────── */}
      <AnimatePresence>
        {revealPhase >= 4 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.65 }}
            style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '4rem 2rem 5rem' }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem',
                filter: 'drop-shadow(0 0 22px rgba(200,168,75,0.85))', userSelect: 'none' }}>⚡</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                color: 'var(--gold)', textShadow: '0 0 30px rgba(200,168,75,0.35)', margin: '0 0 0.6rem' }}>
                Oh Hell!
              </h1>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.72rem', letterSpacing: '0.25em',
                textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.5, margin: 0 }}>
                The Preferred Card Game of the Colgate Diaspora
              </p>
            </div>

            {/* Error toast */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginBottom: '1rem', padding: '0.75rem 1.25rem', borderRadius: '10px',
                    border: '1px solid rgba(255,80,80,0.4)', background: 'rgba(255,40,40,0.08)',
                    fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#ff8888', textAlign: 'center' }}
                >{error}</motion.div>
              )}
            </AnimatePresence>

            {/* Connection indicator */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontFamily: 'var(--font-serif)', fontSize: '0.62rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', color: isConnected ? 'var(--gold)' : '#888', opacity: 0.6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%',
                  background: isConnected ? 'var(--gold)' : '#666',
                  animation: isConnected ? 'shimmer 2s ease-in-out infinite' : 'none',
                  display: 'inline-block' }} />
                {isConnected ? 'Connected' : 'Connecting…'}
              </span>
            </div>

            {/* ── TWO-PANEL LOBBY ───────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem', marginBottom: '1.5rem' }}>

              {/* LEFT — Create a Game */}
              <div style={{ border: '1px solid rgba(200,168,75,0.3)', borderRadius: '16px',
                padding: '2rem', background: 'rgba(13,5,8,0.78)', backdropFilter: 'blur(14px)' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '0.25em',
                  textTransform: 'uppercase', color: 'var(--gold)', margin: '0 0 1.5rem' }}>Create a Game</h2>

                <label style={lbl}>Your Name</label>
                <input type="text" value={createName} onChange={e => setCreateName(e.target.value)}
                  placeholder="e.g. Ollie" style={inp}
                  onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.75)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(200,168,75,0.35)'} />

                <label style={lbl}>Room Name (optional)</label>
                <input type="text" value={createRoom} onChange={e => setCreateRoom(e.target.value)}
                  placeholder="Auto-generated if blank" style={inp}
                  onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.75)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(200,168,75,0.35)'} />

                <label style={lbl}>Number of Players</label>
                <select value={playerCount} onChange={e => setPlayerCount(Number(e.target.value))}
                  style={{ ...inp, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23C8A84B' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', paddingRight: '2.5rem' }}>
                  {[3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n} style={{ background: '#0D0508' }}>{n} Players</option>
                  ))}
                </select>

                <button onClick={handleCreate} disabled={loading || !createName.trim()} style={panelBtn(true)}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'var(--maroon-light)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(200,168,75,0.22)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.boxShadow = 'none' }}>
                  {loading ? 'Dealing…' : 'Deal In'}
                </button>
              </div>

              {/* RIGHT — Join a Game */}
              <div style={{ border: '1px solid rgba(200,168,75,0.15)', borderRadius: '16px',
                padding: '2rem', background: 'rgba(13,5,8,0.5)', backdropFilter: 'blur(10px)' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '0.25em',
                  textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.7, margin: '0 0 1.5rem' }}>
                  Join a Game
                </h2>
                <form onSubmit={handleJoin}>
                  <label style={lbl}>Room Code</label>
                  <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC123" style={{ ...inp, fontFamily: 'var(--font-serif)', letterSpacing: '0.15em' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.75)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,168,75,0.35)'} />

                  <label style={lbl}>Your Name</label>
                  <input type="text" value={joinName} onChange={e => setJoinName(e.target.value)}
                    placeholder="e.g. Bobby" style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.75)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,168,75,0.35)'} />

                  <button type="submit" disabled={loading || !joinCode.trim() || !joinName.trim()} style={panelBtn(false)}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(200,168,75,0.18)' }}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,168,75,0.08)'}>
                    {loading ? 'Joining…' : 'Join Room'}
                  </button>
                </form>
              </div>
            </div>

            {/* ── OPEN ROOMS ──────────────────────────────────── */}
            <div style={{ border: '1px solid rgba(200,168,75,0.12)', borderRadius: '16px',
              padding: '1.5rem 2rem', background: 'rgba(13,5,8,0.4)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '0.25em',
                  textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.5, margin: 0 }}>Open Rooms</h2>
                <span style={{ width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                  background: isConnected ? 'rgba(200,168,75,0.5)' : '#444',
                  animation: isConnected ? 'shimmer 2.2s ease-in-out infinite' : 'none' }} />
              </div>

              {openRooms.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {openRooms.map(room => (
                    <div key={room.roomId} style={{ display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', padding: '0.7rem 1rem', borderRadius: '8px',
                      border: '1px solid rgba(200,168,75,0.15)', background: 'rgba(107,26,42,0.08)' }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem',
                          color: 'var(--cream)', letterSpacing: '0.1em' }}>{room.roomId}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                          color: 'var(--cream)', opacity: 0.4, marginLeft: '0.75rem' }}>
                          {room.hostName} · {room.playerCount}/{room.maxPlayers}
                        </span>
                      </div>
                      <button
                        onClick={() => handleJoin(null, room.roomId)}
                        style={{ padding: '0.3rem 0.8rem', borderRadius: '6px',
                          border: '1px solid rgba(200,168,75,0.35)', background: 'rgba(200,168,75,0.1)',
                          color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '0.62rem',
                          letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,168,75,0.22)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,168,75,0.1)'}>
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Skeleton rows while connecting */}
                  {!isConnected && [160, 120, 200].map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', padding: '0.7rem 0',
                      borderBottom: i < 2 ? '1px solid rgba(200,168,75,0.06)' : 'none' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ width: w, height: 10, borderRadius: 4, background: 'rgba(200,168,75,0.1)',
                          animation: 'shimmer 1.9s ease-in-out infinite', animationDelay: `${i * 0.22}s` }} />
                        <div style={{ width: 52, height: 10, borderRadius: 4, background: 'rgba(200,168,75,0.07)',
                          animation: 'shimmer 1.9s ease-in-out infinite', animationDelay: `${i * 0.22 + 0.1}s` }} />
                      </div>
                    </div>
                  ))}
                  {isConnected && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--cream)',
                      opacity: 0.25, textAlign: 'center', margin: 0, letterSpacing: '0.05em' }}>
                      No open rooms — be the first to deal in.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* ── HOW TO PLAY ──────────────────────────────────── */}
            <div style={{ border: '1px solid rgba(200,168,75,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
              <button onClick={() => setRulesOpen(o => !o)} style={{ width: '100%', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem',
                background: 'rgba(13,5,8,0.62)', border: 'none', cursor: 'pointer',
                borderBottom: rulesOpen ? '1px solid rgba(200,168,75,0.12)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.7rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.8 }}>How to Play Oh Hell!</span>
                <span style={{ color: 'var(--gold)', opacity: 0.5, fontSize: '0.9rem', display: 'inline-block',
                  transform: rulesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>▾</span>
              </button>

              <AnimatePresence>
                {rulesOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden', background: 'rgba(13,5,8,0.35)' }}>
                    <div style={{ padding: '1.25rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {RULES.map((rule, i) => (
                        <div key={i} style={{ borderRadius: '8px', border: '1px solid rgba(200,168,75,0.1)', overflow: 'hidden' }}>
                          <button onClick={() => setOpenRule(openRule === i ? null : i)} style={{ width: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.8rem 1.1rem',
                            background: openRule === i ? 'rgba(200,168,75,0.08)' : 'rgba(107,26,42,0.05)',
                            border: 'none', cursor: 'pointer' }}>
                            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem',
                              letterSpacing: '0.1em', color: 'var(--gold)', opacity: openRule === i ? 1 : 0.6 }}>
                              {rule.title}
                            </span>
                            <span style={{ color: 'var(--gold)', opacity: 0.4, fontSize: '0.75rem',
                              display: 'inline-block', transform: openRule === i ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s ease' }}>▾</span>
                          </button>
                          <AnimatePresence>
                            {openRule === i && (
                              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                                <p style={{ padding: '0.8rem 1.1rem 1rem', fontFamily: 'var(--font-body)',
                                  fontSize: '0.9rem', color: 'var(--cream)', opacity: 0.72, lineHeight: 1.65,
                                  borderTop: '1px solid rgba(200,168,75,0.08)', margin: 0 }}>{rule.body}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
