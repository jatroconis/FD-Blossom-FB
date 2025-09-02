import { useParams, Link } from "react-router-dom";
import { GET_CHARACTERS, type GetCharactersData, type Character,
         SOFT_DELETE, type SoftDeleteData, type SoftDeleteVars,
         RESTORE_CHARACTER, type RestoreData, type RestoreVars } from "../graphql/queries";
import FavoriteButton from "../components/FavoriteButton";
import Comments from "../components/Comments";
import { DetailSkeleton } from "../components/skeletons";
import { useMutation, useQuery } from "@apollo/client/react";

export default function CharacterDetail() {
  const { id } = useParams();
  const charId = Number(id);
  const adminEnabled = import.meta.env.VITE_ENABLE_ADMIN === "1";

  const { data, loading, error } = useQuery<GetCharactersData>(GET_CHARACTERS);
  const character: Character | undefined = data?.characters.find(c => c.id === charId);

  const [softDelete, { loading: deleting }] = useMutation<SoftDeleteData, SoftDeleteVars>(SOFT_DELETE, {
    onCompleted() { /* podrías redirigir a / o mostrar toast */ },
  });

  const [restore, { loading: restoring }] = useMutation<RestoreData, RestoreVars>(RESTORE_CHARACTER, {
    onCompleted() { /* idem */ },
  });

  if (loading) return <DetailSkeleton />;
  if (error) return <p className="text-red-600">Error al cargar: {error.message}</p>;
  if (!character) return (
    <section className="space-y-4">
      <Link to="/" className="text-sm text-indigo-600 hover:underline">← Volver</Link>
      <p className="text-zinc-600">No se encontró el personaje.</p>
    </section>
  );

  return (
    <section className="space-y-4">
      <Link to="/" className="text-sm text-indigo-600 hover:underline">← Volver</Link>

      <div className="grid md:grid-cols-[320px,1fr] gap-6 items-start">
        <img
          src={character.image ?? "/placeholder.png"}
          alt={character.name}
          className="w-full max-w-[320px] aspect-square object-cover rounded-xl border bg-white"
        />

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">{character.name}</h1>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div><dt className="text-zinc-500">Especie</dt><dd className="font-medium">{character.species}</dd></div>
            <div><dt className="text-zinc-500">Género</dt><dd className="font-medium">{character.gender ?? "—"}</dd></div>
            <div><dt className="text-zinc-500">Estado</dt><dd className="font-medium">{character.status ?? "—"}</dd></div>
            <div><dt className="text-zinc-500">Origen</dt><dd className="font-medium">{character.origin ?? "—"}</dd></div>
          </dl>

          <div className="flex gap-3">
            <FavoriteButton id={character.id} isFavorite={character.isFavorite ?? false} />
            {adminEnabled && (
              <>
                <button
                  onClick={() => softDelete({ variables: { id: character.id } })}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded border px-3 py-1 bg-red-50 border-red-300 text-red-700 disabled:opacity-60"
                >
                  {deleting ? "Eliminando…" : "Soft Delete"}
                </button>
                <button
                  onClick={() => restore({ variables: { id: character.id } })}
                  disabled={restoring}
                  className="inline-flex items-center gap-2 rounded border px-3 py-1 bg-emerald-50 border-emerald-300 text-emerald-700 disabled:opacity-60"
                >
                  {restoring ? "Restaurando…" : "Restore"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Comments characterId={character.id} />
    </section>
  );
}