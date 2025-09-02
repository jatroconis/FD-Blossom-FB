
import { useMemo, useState } from "react";
import CharacterCard from "../components/CharacterCard";
import FilterBar from "../components/FilterBar";
import {
  GET_CHARACTERS,
  type GetCharactersData,
  type GetCharactersVars,
  type Character,
} from "../graphql/queries";
import { CardSkeleton } from "../components/skeletons";
import { useQuery } from "@apollo/client/react";

export default function CharactersList() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    species: "",
    gender: "",
    favoriteOnly: false,
  });

  const variables: GetCharactersVars = useMemo(() => {
    const f: GetCharactersVars["filter"] = {};
    if (filters.name) f.name = filters.name;
    if (filters.status) f.status = filters.status;
    if (filters.species) f.species = filters.species;
    if (filters.gender) f.gender = filters.gender;
    if (filters.favoriteOnly) f.favorite = true;
    return { filter: Object.keys(f).length ? f : undefined };
  }, [filters]);

  const { data, loading, error } = useQuery<GetCharactersData, GetCharactersVars>(
    GET_CHARACTERS,
    { variables }
  );

  const list: Character[] = data?.characters ?? [];

  const sorted = useMemo(() => {
    return [...list].sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [list, sortOrder]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Personajes</h1>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 border rounded ${sortOrder === "asc" ? "bg-indigo-100" : ""}`}
            onClick={() => setSortOrder("asc")}
          >
            Orden A–Z
          </button>
          <button
            className={`px-3 py-1 border rounded ${sortOrder === "desc" ? "bg-indigo-100" : ""}`}
            onClick={() => setSortOrder("desc")}
          >
            Orden Z–A
          </button>
        </div>
      </div>

      <FilterBar value={filters} onChange={setFilters} />

        {loading && (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
      {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )}

      {!loading && !error && sorted.length === 0 && (
        <div className="rounded-xl border bg-white p-6 text-center text-zinc-600">
          No hay resultados con los filtros aplicados.
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {sorted.map((c) => (
            <CharacterCard key={c.id} {...c} />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Error al cargar</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}
    </section>
  );
}
