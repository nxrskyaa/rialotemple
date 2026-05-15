import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors duration-300">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
