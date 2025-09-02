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
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition flex flex-col"
    >
      <img
        src={image ?? "/placeholder.png"} 
        alt={name}
        className="h-40 w-full object-cover rounded-t-xl"
      />
      <div className="flex-1 p-3 flex flex-col justify-between">
        <h2 className="font-semibold text-lg truncate">{name}</h2>
        <p className="text-sm text-zinc-500">{species}</p>
        <div className="mt-2">{isFavorite ? "💚 Favorito" : "🤍"}</div>
      </div>
    </Link>
  );
}
