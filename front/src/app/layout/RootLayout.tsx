import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";
export default function RootLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
