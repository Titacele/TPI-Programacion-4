import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-cafe/10 py-6 text-center text-sm text-cafe-suave">
        Food Store · TPI Programación 4
      </footer>
    </div>
  )
}
