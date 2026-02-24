import SectionHeading from '../components/ui/SectionHeading'
import PodcastBar from '../components/ui/PodcastBar'

const episodes = [
  { id: 1, title: "2025 Season Preview",        date: "Sep 4, 2025",  duration: "1h 12m", description: "Predictions, sleepers, and trash talk for the new season." },
  { id: 2, title: "Week 6 Recap & Trade Talk",  date: "Oct 13, 2025", duration: "48m",    description: "Injuries, waiver pickups, and who's buying low." },
  { id: 3, title: "Mid-Season Power Rankings",  date: "Oct 27, 2025", duration: "55m",    description: "Definitive power rankings debate. Hot takes welcome." },
  { id: 4, title: "Trade Deadline Emergency Pod", date: "Nov 10, 2025", duration: "1h 3m", description: "Last-minute trades, snubs, and deadline fallout." },
  { id: 5, title: "2024 Season Wrap-Up",        date: "Jan 8, 2025",  duration: "1h 28m", description: "Full season review. Award ceremony. Chaos." },
]

export default function Podcasts() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 2rem' }}>
      <SectionHeading subtitle="The Official Podcast">Colgate Diaspora Pod</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {episodes.map(ep => (
          <PodcastBar key={ep.id} episode={ep} />
        ))}
      </div>
    </div>
  )
}
