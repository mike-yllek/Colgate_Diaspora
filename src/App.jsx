import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import PasswordGate from './components/PasswordGate'
import Home from './pages/Home'
import Bios from './pages/Bios'
import Archive from './pages/Archive'
import Calendar from './pages/Calendar'
import Podcasts from './pages/Podcasts'
import BookClub from './pages/BookClub'
import OhHellLobby from './pages/OhHell/index'
import OhHellGame from './pages/OhHell/Game'

function App() {
  return (
    <PasswordGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="bios" element={<Bios />} />
            <Route path="archive" element={<Archive />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="podcasts" element={<Podcasts />} />
            <Route path="book-club" element={<BookClub />} />
            <Route path="oh-hell" element={<OhHellLobby />} />
            <Route path="oh-hell/:roomId" element={<OhHellGame />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PasswordGate>
  )
}

export default App
