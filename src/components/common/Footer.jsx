import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-xl bg-surface-container-lowest border-t-2 border-on-background flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-md">
      <Link to="/" className="font-headline-lg text-headline-lg text-on-surface lowercase tracking-tighter hover:text-primary transition-colors">
        lumi.
      </Link>
      <nav className="flex flex-wrap items-center justify-center gap-md">
        {['Terms', 'Privacy', 'Support', 'Careers'].map(item => (
          <a
            key={item}
            href="#"
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>
      <p className="font-body-md text-body-md text-on-surface-variant text-center">
        © 2024 LUMI STUDIOS. ALL RIGHTS RESERVED.
      </p>
    </footer>
  )
}
