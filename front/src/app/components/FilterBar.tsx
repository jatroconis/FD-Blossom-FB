import { useEffect, useState } from "react";

type Props = {
  value: {
    name: string;
    status: string;
    species: string;
    gender: string;
    favoriteOnly: boolean;
  };
  onChange: (next: Props["value"]) => void;
};

const STATUS = ["", "Alive", "Dead", "unknown"];
const GENDER = ["", "Male", "Female", "Genderless", "unknown"];

export default function FilterBar({ value, onChange }: Props) {
  const [local, setLocal] = useState(value);

  // debounce básico para no disparar demasiadas queries
  useEffect(() => {
    const t = setTimeout(() => onChange(local), 300);
    return () => clearTimeout(t);
  }, [local, onChange]);

  const inputClass = "w-full border rounded px-3 py-2 bg-white";
  const selectClass = "w-full border rounded px-3 py-2 bg-white";

  return (
    <div className="grid gap-3 md:grid-cols-12">
      <div className="md:col-span-4">
        <input
          className={inputClass}
          placeholder="Buscar por nombre…"
          value={local.name}
          onChange={(e) => setLocal((s) => ({ ...s, name: e.target.value }))}
        />
      </div>
      <div className="md:col-span-2">
        <select
          className={selectClass}
          value={local.status}
          onChange={(e) => setLocal((s) => ({ ...s, status: e.target.value }))}
        >
          <option value="">Estado</option>
          {STATUS.slice(1).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-3">
        <input
          className={inputClass}
          placeholder="Especie (contiene)…"
          value={local.species}
          onChange={(e) => setLocal((s) => ({ ...s, species: e.target.value }))}
        />
      </div>
      <div className="md:col-span-2">
        <select
          className={selectClass}
          value={local.gender}
          onChange={(e) => setLocal((s) => ({ ...s, gender: e.target.value }))}
        >
          <option value="">Género</option>
          {GENDER.slice(1).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <label className="md:col-span-1 inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={local.favoriteOnly}
          onChange={(e) =>
            setLocal((s) => ({ ...s, favoriteOnly: e.target.checked }))
          }
        />
        <span className="text-sm">Favoritos</span>
      </label>
    </div>
  );
}
