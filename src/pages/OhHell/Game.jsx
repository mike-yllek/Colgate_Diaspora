import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useOhHell } from '../../hooks/useOhHell'
import Scoreboard from './components/Scoreboard'
import PlayerHand from './components/PlayerHand'
import BidPanel from './components/BidPanel'
import CardDeck from './components/CardDeck'

const SUIT_COLORS = {
  '♠': '#2a2a3a',
  '♣': '#2a2a3a',
  '♥': '#cc2222',
  '♦': '#cc3311',
}
const TRUMP_META = {
  '♥': { color: '#ff6666', bg: 'rgba(204,34,34,0.14)',  border: 'rgba(255,100,100,0.4)' },
  '♦': { color: '#ff7755', bg: 'rgba(204,51,17,0.14)',  border: 'rgba(255,120,80,0.4)'  },
  '♠': { color: '#d0cccc', bg: 'rgba(200,168,75,0.08)', border: 'rgba(200,188,188,0.3)' },
  '♣': { color: '#d0cccc', bg: 'rgba(200,168,75,0.08)', border: 'rgba(200,188,188,0.3)' },
}

// ─── Confetti ─────────────────────────────────────────────────────
const PIECES = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: (i * 1.87) % 100,
  delay: (i * 0.065) % 3.2,
  dur: 2.4 + (i * 0.057) % 2.2,
  color: ['#C8A84B', '#6B1A2A', '#F5F0E8', '#FFE066', '#9B2A3A', '#E8CC7A', '#ffffff'][i % 7],
  size: 5 + (i * 0.37) % 9,
  circle: i % 3 === 0,
}))

function Confetti() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 55,
    }}>
      {PIECES.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '-8vh', x: `${p.x}vw`, rotate: 0 }}
          animate={{ y: '110vh', rotate: p.id % 2 === 0 ? 720 : -540 }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 0.4,
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.circle ? '50%' : '2px',
            opacity: 0.88,
          }}
        />
      ))}
    </div>
  )
}

// ─── TableCard ────────────────────────────────────────────────────
function TableCard({ card, player, index }) {
  const color = SUIT_COLORS[card.suit] || '#222'
  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0, y: -50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, delay: index * 0.1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}
    >
      <div style={{
        width: '56px',
        height: '80px',
        borderRadius: '5px',
        border: '1px solid rgba(0,0,0,0.1)',
        background: 'linear-gradient(155deg, #faf8f4 0%, #ede5d4 100%)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4px 5px',
        userSelect: 'none',
      }}>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color,
          lineHeight: 1.15,
          fontFamily: 'var(--font-body)',
        }}>
          {card.rank}<br />{card.suit}
        </span>
        <span style={{
          fontSize: '1.1rem',
          color,
          alignSelf: 'center',
          opacity: 0.7,
          lineHeight: 1,
        }}>
          {card.suit}
        </span>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color,
          lineHeight: 1.15,
          fontFamily: 'var(--font-body)',
          transform: 'rotate(180deg)',
          alignSelf: 'flex-end',
        }}>
          {card.rank}<br />{card.suit}
        </span>
      </div>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.65rem',
        color: 'var(--cream)',
        opacity: 0.5,
        letterSpacing: '0.05em',
      }}>
        {player}
      </span>
    </motion.div>
  )
}

// ─── TrumpBadge ───────────────────────────────────────────────────
function TrumpBadge({ suit }) {
  if (!suit) return null
  const m = TRUMP_META[suit] || TRUMP_META['♠']
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.22rem 0.65rem',
      borderRadius: '20px',
      border: `1px solid ${m.border}`,
      background: m.bg,
    }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.58rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: m.color,
        opacity: 0.75,
      }}>
        Trump
      </span>
      <span style={{ fontSize: '1rem', color: m.color, lineHeight: 1 }}>
        {suit}
      </span>
    </div>
  )
}

// ─── WaitingRoom ──────────────────────────────────────────────────
function WaitingRoom({ roomId, players, isHost, onStart }) {
  const canStart = players.length >= 3
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2.5rem',
      padding: '2rem',
    }}>
      <CardDeck count={5} />

      <div style={{ textAlign: 'center' }}>
        <motion.p
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: 'var(--gold)',
            margin: '0 0 0.5rem',
          }}
        >
          Waiting for players…
        </motion.p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--cream)',
          opacity: 0.4,
          margin: 0,
        }}>
          Share code:{' '}
          <span style={{
            color: 'var(--gold)',
            opacity: 1,
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-serif)',
          }}>
            {roomId}
          </span>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '220px' }}>
        {players.map(p => (
          <div key={p.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.8rem',
            borderRadius: '8px',
            border: `1px solid ${p.connected ? 'rgba(200,168,75,0.28)' : 'rgba(200,168,75,0.08)'}`,
            background: p.connected ? 'rgba(200,168,75,0.06)' : 'transparent',
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.82rem',
              color: p.connected ? 'var(--cream)' : 'rgba(200,168,75,0.28)',
            }}>
              {p.name}{p.isHost ? ' ★' : ''}
            </span>
            {p.connected ? (
              <span style={{ fontSize: '0.8rem', color: 'var(--gold)', opacity: 0.7 }}>✓</span>
            ) : (
              <motion.span
                animate={{ opacity: [0.2, 0.65, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.75rem',
                  color: 'var(--gold)',
                  opacity: 0.3,
                  letterSpacing: '0.1em',
                }}
              >
                · · ·
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {isHost && (
        <button
          onClick={onStart}
          disabled={!canStart}
          style={{
            padding: '0.85rem 2.5rem',
            borderRadius: '8px',
            border: `1px solid ${canStart ? 'var(--gold)' : 'rgba(200,168,75,0.2)'}`,
            background: canStart ? 'var(--maroon)' : 'transparent',
            color: canStart ? 'var(--gold)' : 'rgba(200,168,75,0.3)',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: canStart ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => { if (canStart) e.currentTarget.style.background = 'var(--maroon-light)' }}
          onMouseLeave={e => { if (canStart) e.currentTarget.style.background = canStart ? 'var(--maroon)' : 'transparent' }}
        >
          {canStart
            ? 'Start Game'
            : `Need ${3 - players.length} more player${3 - players.length !== 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}

// ─── RoundSummary overlay ─────────────────────────────────────────
function RoundSummary({ players, round, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(13,5,8,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
      }}
    >
      <motion.div
        initial={{ scale: 0.82, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          border: '1px solid rgba(200,168,75,0.3)',
          borderRadius: '20px',
          padding: '2.5rem',
          background: 'rgba(13,5,8,0.92)',
          width: '480px',
          maxWidth: '90vw',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          color: 'var(--gold)',
          textAlign: 'center',
          margin: '0 0 0.4rem',
        }}>
          Round {round} Complete
        </h2>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.62rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.45,
          textAlign: 'center',
          margin: '0 0 2rem',
        }}>
          Round Summary
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '2rem' }}>
          {players.map(p => (
            <div key={p.name} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: `1px solid ${p.hit ? 'rgba(200,168,75,0.25)' : 'rgba(255,80,80,0.14)'}`,
              background: p.hit ? 'rgba(200,168,75,0.06)' : 'rgba(255,40,40,0.04)',
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.85rem',
                color: 'var(--cream)',
              }}>
                {p.name}
              </span>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'var(--cream)',
                  opacity: 0.45,
                }}>
                  {p.tricks}/{p.bid}
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  color: p.hit ? 'var(--gold)' : 'rgba(255,90,90,0.7)',
                  minWidth: '3.2rem',
                  textAlign: 'right',
                }}>
                  {p.hit ? `+${p.roundScore}` : '±0'}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  color: 'var(--cream)',
                  opacity: 0.3,
                  minWidth: '3.2rem',
                  textAlign: 'right',
                }}>
                  → {p.score}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onContinue}
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '8px',
            border: '1px solid var(--gold)',
            background: 'var(--maroon)',
            color: 'var(--gold)',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--maroon-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--maroon)'}
        >
          Next Round
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── GameOver overlay ─────────────────────────────────────────────
function GameOver({ players, onExit }) {
  const winner = players[0]
  const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <>
      <Confetti />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(13,5,8,0.9)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40,
        }}
      >
        <motion.div
          initial={{ scale: 0.78, y: 32 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 24 }}
          style={{
            border: '1px solid rgba(200,168,75,0.4)',
            borderRadius: '20px',
            padding: '2.5rem',
            background: 'rgba(13,5,8,0.96)',
            width: '440px',
            maxWidth: '90vw',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontSize: '3.2rem',
            marginBottom: '0.75rem',
            filter: 'drop-shadow(0 0 20px rgba(200,168,75,0.85))',
          }}>
            🏆
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            color: 'var(--gold)',
            margin: '0 0 0.4rem',
            textShadow: '0 0 30px rgba(200,168,75,0.55)',
          }}>
            {winner.name} Wins!
          </h2>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.62rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.45,
            margin: '0 0 2rem',
          }}>
            Final Standings
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            {players.map(p => (
              <div key={p.name} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: `1px solid ${p.rank === 1 ? 'rgba(200,168,75,0.4)' : 'rgba(200,168,75,0.08)'}`,
                background: p.rank === 1 ? 'rgba(200,168,75,0.1)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <span style={{
                    fontSize: '1rem',
                    minWidth: '1.4rem',
                    textAlign: 'left',
                  }}>
                    {MEDALS[p.rank] || `#${p.rank}`}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.88rem',
                    color: p.rank === 1 ? 'var(--gold)' : 'var(--cream)',
                  }}>
                    {p.name}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.92rem',
                  color: p.rank === 1 ? 'var(--gold-bright)' : 'var(--cream)',
                }}>
                  {p.score}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onExit}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--gold)',
              background: 'var(--maroon)',
              color: 'var(--gold)',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--maroon-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--maroon)'}
          >
            Return to Lobby
          </button>
        </motion.div>
      </motion.div>
    </>
  )
}

// ─── Main Game Component ──────────────────────────────────────────
export default function OhHellGame() {
  const { roomId }  = useParams()
  const navigate    = useNavigate()

  const {
    gameState,
    myHand,
    myPlayerId,
    myTurnPhase,
    roundSummary,
    finalResult,
    startGame,
    placeBid,
    playCard,
    nextRound,
  } = useOhHell()

  const phase        = gameState?.phase || 'waiting'
  const players      = gameState?.players || []
  const currentTrick = gameState?.currentTrick || []
  const trump        = gameState?.trump

  const myPlayer = players.find(p => p.id === myPlayerId)
  const isHost   = myPlayer?.isHost ?? false

  // Who needs to act right now?
  const currentActorId   = gameState?.currentBidderId || gameState?.currentPlayerId
  const currentActorName = players.find(p => p.id === currentActorId)?.name

  const handlePlayCard = (card) => {
    if (myTurnPhase !== 'play') return
    const cardIndex = myHand.findIndex(c => c.rank === card.rank && c.suit === card.suit)
    if (cardIndex !== -1) playCard(roomId, cardIndex)
  }

  const handleBid = (bid) => placeBid(roomId, bid)

  // Normalize data for overlays
  const roundSummaryPlayers = roundSummary?.map(r => ({
    name:       r.playerName,
    bid:        r.bid,
    tricks:     r.tricks,
    hit:        r.hit,
    roundScore: r.roundScore,
    score:      r.totalScore,
  }))

  const finalPlayers = finalResult?.finalScores?.map(r => ({
    name:  r.playerName,
    score: r.score,
    rank:  r.rank,
  }))

  const showHand    = phase === 'bidding' || phase === 'playing'
  const showBidPanel = myTurnPhase === 'bid'

  return (
    <div style={{
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateRows: '56px 1fr',
      background: 'radial-gradient(ellipse at 50% 15%, rgba(61,10,20,0.65) 0%, rgba(13,5,8,0.98) 70%)',
    }}>

      {/* ── TOP BAR ──────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        borderBottom: '1px solid rgba(200,168,75,0.1)',
        background: 'rgba(13,5,8,0.65)',
        backdropFilter: 'blur(10px)',
        gap: '1rem',
      }}>
        {/* Left: Brand + Room */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            color: 'var(--gold)',
            filter: 'drop-shadow(0 0 8px rgba(200,168,75,0.4))',
          }}>
            ⚡ Oh Hell!
          </span>
          <span style={{
            padding: '0.18rem 0.55rem',
            borderRadius: '20px',
            border: '1px solid rgba(200,168,75,0.18)',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'var(--cream)',
            opacity: 0.45,
            textTransform: 'uppercase',
          }}>
            {roomId}
          </span>
        </div>

        {/* Center: Round + Trump + Turn */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          {gameState?.round > 0 && (
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              opacity: 0.6,
            }}>
              Round {gameState.round} of {gameState.maxRound}
            </span>
          )}
          <TrumpBadge suit={trump?.suit} />
          {currentActorName && (phase === 'bidding' || phase === 'playing') && (
            <motion.div
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                padding: '0.18rem 0.65rem',
                borderRadius: '20px',
                border: '1px solid rgba(200,168,75,0.28)',
                background: 'rgba(107,26,42,0.28)',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.62rem',
                letterSpacing: '0.08em',
                color: 'var(--cream)',
              }}
            >
              {currentActorId === myPlayerId ? 'Your turn' : `${currentActorName}'s turn`}
            </motion.div>
          )}
        </div>

        {/* Right: Leave */}
        <div style={{ flexShrink: 0 }}>
          <button
            onClick={() => navigate('/oh-hell')}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--cream)',
              opacity: 0.32,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.32'}
          >
            ← Leave
          </button>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* Left: Scoreboard sidebar */}
        <aside style={{
          width: '260px',
          flexShrink: 0,
          borderRight: '1px solid rgba(200,168,75,0.08)',
          overflowY: 'auto',
          padding: '1.25rem',
        }}>
          <Scoreboard players={players} round={gameState?.round} />
        </aside>

        {/* Center: Main game area */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}>
          {phase === 'waiting' ? (
            <WaitingRoom
              roomId={roomId}
              players={players}
              isHost={isHost}
              onStart={() => startGame(roomId)}
            />
          ) : (
            <>
              {/* Table area */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                overflow: 'hidden',
              }}>
                {/* Felt oval */}
                <div style={{
                  width: 'min(520px, 90%)',
                  height: '190px',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at 45% 38%, #2a5c2a 0%, #1a3d1a 55%, #0e2414 100%)',
                  border: '2px solid rgba(200,168,75,0.1)',
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.5rem',
                  position: 'relative',
                }}>
                  {/* Inner ring */}
                  <div style={{
                    position: 'absolute',
                    inset: '12px',
                    borderRadius: '50%',
                    border: '1px solid rgba(200,168,75,0.06)',
                    pointerEvents: 'none',
                  }} />

                  <AnimatePresence>
                    {phase === 'playing' && currentTrick.map((entry, i) => (
                      <TableCard
                        key={`${entry.card.rank}${entry.card.suit}${entry.playerId}`}
                        card={entry.card}
                        player={entry.playerName}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>

                  {(phase !== 'playing' || currentTrick.length === 0) && (
                    <p style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--cream)',
                      opacity: 0.18,
                      userSelect: 'none',
                    }}>
                      {phase === 'bidding' ? 'Place your bid' : 'No cards played'}
                    </p>
                  )}
                </div>
              </div>

              {/* Player hand */}
              {showHand && (
                <div style={{
                  flexShrink: 0,
                  padding: '0.6rem 2rem 1.25rem',
                  borderTop: '1px solid rgba(200,168,75,0.06)',
                  background: 'rgba(13,5,8,0.35)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    opacity: myTurnPhase === 'play' ? 0.7 : 0.32,
                    textAlign: 'center',
                    margin: '0 0 0.4rem',
                    transition: 'opacity 0.3s ease',
                  }}>
                    {myTurnPhase === 'play' ? 'Your turn — play a card' : 'Your Hand'}
                  </p>
                  <PlayerHand
                    cards={myHand}
                    onPlay={myTurnPhase === 'play' ? handlePlayCard : undefined}
                  />
                </div>
              )}
            </>
          )}
        </main>

        {/* Right: Bid panel (slides in when it's your turn to bid) */}
        <motion.aside
          animate={{ width: showBidPanel ? '280px' : '0px' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          style={{
            flexShrink: 0,
            overflow: 'hidden',
            borderLeft: '1px solid rgba(200,168,75,0.08)',
          }}
        >
          <div style={{
            width: '280px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}>
            <BidPanel
              round={gameState?.handSize || 1}
              playerCount={players.length}
              forbidden={gameState?.forbiddenBid}
              onBid={handleBid}
            />
          </div>
        </motion.aside>
      </div>

      {/* ── OVERLAYS ─────────────────────────────────────────── */}
      <AnimatePresence>
        {roundSummaryPlayers && phase === 'round_end' && (
          <RoundSummary
            key="round_end"
            players={roundSummaryPlayers}
            round={gameState?.round}
            onContinue={() => nextRound(roomId)}
          />
        )}
        {finalPlayers && (
          <GameOver
            key="game_end"
            players={finalPlayers}
            onExit={() => navigate('/oh-hell')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
