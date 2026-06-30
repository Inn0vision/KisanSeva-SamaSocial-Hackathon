import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import Disease from './pages/Disease'
import Pesticide from './pages/Pesticide'
import Weather from './pages/Weather'
import Schemes from './pages/Schemes'
import Land from './pages/Land'
import Water from './pages/Water'
import Waste from './pages/Waste'
import Stories from './pages/Stories'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SetupProfile from './pages/SetupProfile'
import Chat from './pages/Chat'
import ProtectedRoute from './components/layout/ProtectedRoute'

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/setup-profile" element={<SetupProfile />} />
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/disease" element={<Disease />} />
            <Route path="/pesticide" element={<Pesticide />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/land" element={<Land />} />
            <Route path="/water" element={<Water />} />
            <Route path="/waste" element={<Waste />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
