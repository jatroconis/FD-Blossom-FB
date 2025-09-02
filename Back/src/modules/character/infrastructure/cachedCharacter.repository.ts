import type { CharacterRepository } from '../domain/character.repository';
import type { Character, CharacterFilter } from '../domain/character.entity';
import { cacheGet, cacheSet } from '../../../infrastructure/cache/redisCache';
import { characterSearchKey } from '../../../infrastructure/cache/keys';

const TTL = Number(process.env.CACHE_TTL_SECONDS ?? 60);

export class CachedCharacterRepository implements CharacterRepository {
    constructor(private readonly inner: CharacterRepository) { }

    async search(filter: CharacterFilter): Promise<Character[]> {
        const key = characterSearchKey(filter as Record<string, unknown>);
        const hit = await cacheGet<Character[]>(key);
        if (hit) return hit;

        const data = await this.inner.search(filter);
        await cacheSet(key, data, TTL);
        return data;
    }

    async softDelete(id: number): Promise<boolean> {
        //  se encarga de invalidar la caché
        return this.inner.softDelete(id);
    }

    async restore(id: number): Promise<boolean> {
        // se encarga de invalidar la caché
        return this.inner.restore(id);
    }
}
