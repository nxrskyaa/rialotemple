import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0F', color: '#F0F0F5' }}>
      <Navbar />
      <div className="pt-24">
        <Outlet />
      </div>
    </div>
  )
}
