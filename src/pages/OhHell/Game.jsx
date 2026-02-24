import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Scoreboard from './components/Scoreboard'
import PlayerHand from './components/PlayerHand'
import BidPanel from './components/BidPanel'
import CardDeck from './components/CardDeck'

export default function OhHellGame() {
  const { roomId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const playerName = state?.playerName || 'Guest'

  const [gameState, setGameState] = useState({
    phase: 'waiting', // waiting | bidding | playing | roundEnd | gameOver
    round: 1,
    maxRound: 7,
    players: [{ name: playerName, score: 0, bid: null, tricks: 0 }],
    hand: [],
    trump: null,
    currentTrick: [],
    scores: [],
  })

  // Socket.io connection would be initialized here
  // useEffect(() => {
  //   const socket = io(import.meta.env.VITE_SERVER_URL)
  //   socket.emit('join', { roomId, playerName })
  //   socket.on('gameState', setGameState)
  //   return () => socket.disconnect()
  // }, [roomId, playerName])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gridTemplateColumns: '280px 1fr',
      gap: 0,
      background: 'radial-gradient(ellipse at 50% 30%, rgba(61,10,20,0.5) 0%, rgba(13,5,8,0.95) 70%)',
    }}>
      {/* Header */}
      <div style={{
        gridColumn: '1 / -1',
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(200,168,75,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: 'var(--gold)',
          }}>
            ⚡ Oh Hell!
          </span>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.5,
            marginLeft: '1rem',
          }}>
            Room: {roomId}
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          opacity: 0.6,
        }}>
          Round {gameState.round} / {gameState.maxRound}
        </div>
        <button
          onClick={() => navigate('/oh-hell')}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--cream)',
            opacity: 0.5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ← Leave
        </button>
      </div>

      {/* Sidebar: Scoreboard */}
      <aside style={{
        borderRight: '1px solid rgba(200,168,75,0.1)',
        overflowY: 'auto',
        padding: '1.5rem',
      }}>
        <Scoreboard players={gameState.players} round={gameState.round} />
      </aside>

      {/* Main game area */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '2rem',
      }}>
        {gameState.phase === 'waiting' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              color: 'var(--gold)',
              marginBottom: '1rem',
            }}>
              Waiting for players...
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              opacity: 0.5,
              fontSize: '0.9rem',
            }}>
              Share room code: <strong style={{ color: 'var(--gold)' }}>{roomId}</strong>
            </p>
            <div style={{ marginTop: '2rem' }}>
              <CardDeck />
            </div>
          </div>
        )}

        {(gameState.phase === 'bidding' || gameState.phase === 'playing') && (
          <>
            {/* Trump indicator */}
            {gameState.trump && (
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                border: '1px solid rgba(200,168,75,0.3)',
                borderRadius: '6px',
                padding: '0.4rem 1rem',
              }}>
                Trump: {gameState.trump}
              </div>
            )}

            {gameState.phase === 'bidding' && (
              <BidPanel
                round={gameState.round}
                playerCount={gameState.players.length}
                onBid={(bid) => console.log('Bid:', bid)}
              />
            )}

            <PlayerHand cards={gameState.hand} onPlay={(card) => console.log('Play:', card)} />
          </>
        )}
      </main>

      {/* Bottom: current trick display would go here */}
    </div>
  )
}
