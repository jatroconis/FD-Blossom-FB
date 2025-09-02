import { Link } from "react-router-dom";

type Props = {
  id: number;
  name: string;
  species: string;
  image?: string | null;
  isFavorite?: boolean | null;
};

export default function CharacterCard({ id, name, species, image, isFavorite }: Props) {
  return (
    <Link
      to={`/character/${id}`}
      className="bg-white rounded-2xl shadow-card border hover:shadow-md transition flex flex-col overflow-hidden"
    >
      <img
        src={image ?? "/placeholder.png"}
        alt={name}
        className="h-44 w-full object-cover"
      />
      <div className="p-4 space-y-1">
        <h2 className="font-semibold text-lg leading-tight truncate">{name}</h2>
        <p className="text-sm text-zinc-500">{species}</p>
        <div className="pt-2">
          <span
            className={`inline-flex items-center gap-1 text-xs rounded-full px-2 py-1 border
              ${isFavorite ? "bg-secondary-600/10 border-secondary-600 text-secondary-600"
                           : "bg-primary-100 border-primary-600/30 text-primary-700/80"}`}
          >
            {isFavorite ? "💚 Favorito" : "🤍"}
          </span>
        </div>
      </div>
    </Link>
  );
}
