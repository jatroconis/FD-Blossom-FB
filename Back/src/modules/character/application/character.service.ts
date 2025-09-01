import type { Character, CharacterFilter } from '../domain/character.entity';
import type { CharacterRepository } from '../domain/character.repository';

// Decorador/HOF simple para medir tiempo de ejecución
async function measure<T>(label: string, fn: () => Promise<T> | T): Promise<T> {
    const start = process.hrtime.bigint();
    const result = await fn();
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1_000_000;
    // console.log(`${label} took ${ms.toFixed(1)} ms`);
    return result;
}

export class CharacterService {
    constructor(private readonly repo: CharacterRepository) { }

    async search(filter: CharacterFilter): Promise<Character[]> {
        return measure('CharacterService.search', () => this.repo.search(filter));
    }
}
