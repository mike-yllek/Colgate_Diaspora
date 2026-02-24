import CardBack from '../../../components/cards/CardBack'

/**
 * Renders a fanned-out deck of card backs, used in the waiting room.
 */
export default function CardDeck({ count = 5 }) {
  return (
    <div style={{
      position: 'relative',
      width: '160px',
      height: '120px',
      margin: '0 auto',
    }}>
      {[...Array(count)].map((_, i) => {
        const angle = (i - Math.floor(count / 2)) * 10
        const offsetX = (i - Math.floor(count / 2)) * 18
        return (
          <div key={i} style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: `translateX(calc(-50% + ${offsetX}px)) rotate(${angle}deg)`,
            transformOrigin: 'bottom center',
            transition: 'transform 0.3s ease',
            zIndex: i,
          }}>
            <CardBack size="md" />
          </div>
        )
      })}
    </div>
  )
}
