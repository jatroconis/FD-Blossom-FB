import axios from 'axios';
import { asUpstreamError } from '../../../shared/http/upstream-error';

const BASE = process.env.RM_API_URL ?? 'https://rickandmortyapi.com/api';
const TIMEOUT = Number(process.env.RM_REQUEST_TIMEOUT_MS ?? 10000);
const RETRY_MAX = Number(process.env.RM_RETRY_MAX ?? 3);
const RETRY_DELAY = Number(process.env.RM_RETRY_DELAY_MS ?? 600);

const http = axios.create({
    baseURL: BASE,
    timeout: TIMEOUT,
    headers: {
        Accept: 'application/json',
        'User-Agent': 'rickmorty-sync/1.0 (+http://localhost)'
    }
});

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

export interface RMCharacter {
    id: number; name: string; status: string; species: string; gender: string;
    origin: { name: string };
    image?: string;
    created?: string;
}
interface RMResp { info: { next: string | null }; results: RMCharacter[]; }

export async function fetchCharactersPage(page: number): Promise<RMResp> {
    let attempt = 0;
    while (true) {
        attempt++;
        try {
            const { data } = await http.get<RMResp>(`/character?page=${page}`);
            return data;
        } catch (err: any) {
            // Duck-typing: tomamos status/code si vienen (axios-like), sin importar axios aquí.
            const status: number | undefined = err?.response?.status;
            const retriable =
                !status || status >= 500 || status === 429 || err?.code === 'ECONNABORTED';
            if (retriable && attempt < RETRY_MAX) {
                await sleep(RETRY_DELAY * attempt);
                continue;
            }
            throw asUpstreamError(err);
        }
    }
}
