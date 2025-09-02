
import { useMemo, useState } from "react";
import { GET_CHARACTERS, type GetCharactersData, type Character } from "../graphql/queries";
import { useQuery } from "@apollo/client/react";
import CharacterCard from "./CharacterCard";

export default function CharactersList() {
  const { data, loading, error } = useQuery<GetCharactersData>(GET_CHARACTERS);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list: Character[] = data?.characters ?? [];

  const sorted = useMemo(() => {
    return [...list].sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [list, sortOrder]);

  if (loading) return <p>Cargando personajes...</p>;
  if (error) return <p>Error al cargar: {error.message}</p>;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Personajes</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-full border transition
              ${sortOrder === "asc"
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white border-primary-600 text-primary-700 hover:bg-primary-100"}`}
            onClick={() => setSortOrder("asc")}
          >
            Orden A–Z
          </button>
          <button
            className={`px-4 py-2 rounded-full border transition
              ${sortOrder === "desc"
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white border-primary-600 text-primary-700 hover:bg-primary-100"}`}
            onClick={() => setSortOrder("desc")}
          >
            Orden Z–A
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {sorted.map((c) => (
          <CharacterCard key={c.id} {...c} />
        ))}
      </div>
    </section>
  );
}
