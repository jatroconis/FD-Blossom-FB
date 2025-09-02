
import { useMutation } from "@apollo/client/react";
import {
  TOGGLE_FAVORITE,
  type ToggleFavoriteData,
  type ToggleFavoriteVars,
  GET_CHARACTERS,
  type GetCharactersData,
} from "../graphql/queries";

type Props = { id: number; isFavorite?: boolean | null; size?: "sm" | "md" };

export default function FavoriteButton({ id, isFavorite, size = "md" }: Props) {
  const [toggle, { loading }] = useMutation<ToggleFavoriteData, ToggleFavoriteVars>(
    TOGGLE_FAVORITE,
    {
      optimisticResponse: {
        toggleFavorite: { characterId: id, isFavorite: !isFavorite },
      },
      update(cache, { data }) {
        if (!data) return;
        const existing = cache.readQuery<GetCharactersData>({ query: GET_CHARACTERS });
        if (!existing) return;
        const updated = existing.characters.map((c) =>
          c.id === data.toggleFavorite.characterId
            ? { ...c, isFavorite: data.toggleFavorite.isFavorite }
            : c
        );
        cache.writeQuery<GetCharactersData>({
          query: GET_CHARACTERS,
          data: { characters: updated },
        });
      },
    }
  );

  return (
    <button
      onClick={() => toggle({ variables: { id } })}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition
  ${isFavorite ? "bg-secondary-600/10 border-secondary-600 text-secondary-600"
               : "bg-white border-primary-600 text-primary-700 hover:bg-primary-100"}`}
      title={isFavorite ? "Quitar de favoritos" : "Marcar como favorito"}
    >
      <span className={size === "sm" ? "text-base" : "text-lg"}>
        {isFavorite ? "💚" : "🤍"}
      </span>
      <span className="text-sm">
        {isFavorite ? "Favorito" : "Agregar a favoritos"}
      </span>
    </button>
  );
}
