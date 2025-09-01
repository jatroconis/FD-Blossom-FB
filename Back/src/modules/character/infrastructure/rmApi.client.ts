import axios from 'axios';

const BASE = process.env.RM_API_URL ?? 'https://rickandmortyapi.com/api';

export interface RMCharacter {
    id: number; name: string; status: string; species: string; gender: string;
    origin: { name: string };
    image?: string;
    created?: string;
}

interface RMResp {
    info: { next: string | null };
    results: RMCharacter[];
}

export async function fetchCharactersPage(page: number): Promise<RMResp> {
    const url = `${BASE}/character?page=${page}`;
    const { data } = await axios.get<RMResp>(url);
    return data;
}
