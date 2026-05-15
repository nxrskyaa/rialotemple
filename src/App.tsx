import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Review from './pages/Review'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/review" element={<Review />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
