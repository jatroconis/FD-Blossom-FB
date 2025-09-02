import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold tracking-tight text-primary-700">
          Rick & Morty Explorer
        </Link>
        <nav className="text-sm">
          <Link to="/" className="text-primary-700 hover:text-primary-600 underline-offset-4 hover:underline">
            Personajes
          </Link>
        </nav>
      </div>
    </header>
  );
}
