import SectionHeading from '../components/ui/SectionHeading'
import EventCard from '../components/ui/EventCard'
import events from '../data/events'

export default function Calendar() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 2rem' }}>
      <SectionHeading subtitle="Schedule & Key Dates">Calendar</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
