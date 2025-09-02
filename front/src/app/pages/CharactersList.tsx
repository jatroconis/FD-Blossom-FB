export default function CharactersList() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Personajes</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded">Orden A–Z</button>
          <button className="px-3 py-1 border rounded">Orden Z–A</button>
        </div>
      </div>

      {/* Grid responsive */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        <div className="h-48 bg-white border rounded-xl shadow-sm grid place-items-center">
          <span className="text-zinc-500">conexion grapgql</span>
        </div>
      </div>
    </section>
  );
}
