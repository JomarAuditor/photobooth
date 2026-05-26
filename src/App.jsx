import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Landing from './screens/Landing'
import Studio from './screens/Studio'
import Processing from './screens/Processing'
import Gallery from './screens/Gallery'
import AuthModal from './screens/AuthModal'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-background text-on-surface">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/auth" element={<AuthModal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
