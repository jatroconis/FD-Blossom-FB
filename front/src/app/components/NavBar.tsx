import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          Rick & Morty Explorer
        </Link>
        <nav className="text-sm space-x-4">
          <Link to="/" className="hover:underline">Personajes</Link>
        </nav>
      </div>
    </header>
  );
}
