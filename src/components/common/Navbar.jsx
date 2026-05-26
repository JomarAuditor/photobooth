import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { to: '/studio', label: 'Studio' },
    { to: '/gallery', label: 'Gallery' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className="h-[72px] w-full top-0 sticky z-50 bg-surface border-b-2 border-on-background shadow-[4px_4px_0px_0px_rgba(27,28,28,1)] flex justify-between items-center px-margin-mobile md:px-margin-desktop">
        {/* Brand */}
        <Link
          to="/"
          className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface lowercase tracking-tighter hover:text-primary transition-colors"
        >
          lumi.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-md">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body-md text-body-md px-sm py-xs border-2 transition-all duration-200 ${
                isActive(link.to)
                  ? 'text-primary border-primary font-semibold'
                  : 'text-on-surface-variant border-transparent hover:bg-surface-container-high hover:border-on-background'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-sm">
          <button
            onClick={() => navigate('/studio')}
            className="bg-primary-container text-on-primary-container border-2 border-on-background px-sm py-xs font-label-md text-label-md neo-pop-shadow neo-pop-shadow-hover neo-pop-shadow-active transition-all duration-200"
          >
            start capturing
          </button>
          {user ? (
            <div className="flex items-center gap-xs">
              <span className="font-technical-sm text-technical-sm text-on-surface-variant truncate max-w-[120px]">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                className="p-xs text-primary hover:bg-surface-container-high transition-colors border-2 border-transparent hover:border-on-background"
                title="Sign out"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="p-xs text-primary hover:bg-surface-container-high transition-colors border-2 border-transparent hover:border-on-background"
              title="Sign in"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-xs border-2 border-transparent hover:border-on-background hover:bg-surface-container-high transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-on-surface">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-on-background/60" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute top-[72px] left-0 right-0 bg-surface border-b-2 border-on-background shadow-[0_8px_0px_0px_rgba(27,28,28,1)] p-md flex flex-col gap-xs"
            onClick={e => e.stopPropagation()}
          >
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`px-sm py-sm font-body-lg text-body-lg border-2 transition-all ${
                  isActive(link.to)
                    ? 'text-primary border-primary bg-primary-fixed'
                    : 'text-on-surface border-transparent hover:bg-surface-container-high hover:border-on-background'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t-2 border-on-background mt-xs pt-xs">
              <button
                onClick={() => { navigate('/studio'); setMenuOpen(false) }}
                className="w-full bg-primary-container text-on-primary-container border-2 border-on-background py-sm font-label-md text-label-md neo-pop-shadow neo-pop-shadow-active transition-all"
              >
                start capturing
              </button>
            </div>
            {user ? (
              <button
                onClick={() => { signOut(); setMenuOpen(false) }}
                className="w-full border-2 border-on-background py-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-all"
              >
                sign out ({user.email?.split('@')[0]})
              </button>
            ) : (
              <button
                onClick={() => { navigate('/auth'); setMenuOpen(false) }}
                className="w-full border-2 border-on-background py-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-all"
              >
                sign in
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
