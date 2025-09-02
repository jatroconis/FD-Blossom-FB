import { useParams, Link } from "react-router-dom";

export default function CharacterDetail() {
  const { id } = useParams();
  return (
    <section className="space-y-4">
      <Link to="/" className="text-sm text-indigo-600 hover:underline">Volver</Link>
      <h1 className="text-2xl font-bold">Detalle de personaje #{id}</h1>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
            dasdjnasoidasnd
      </div>
    </section>
  );
}