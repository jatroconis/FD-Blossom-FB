import { describe, it, expect, vi } from 'vitest';
import type { Character, CharacterFilter } from '../../domain/character.entity';
import type { CharacterRepository } from '../../domain/character.repository';
import { CharacterService } from '../character.service';

class FakeRepo implements CharacterRepository {
    constructor(private data: Character[]) { }
    async search(filter: CharacterFilter): Promise<Character[]> {
        const f = {
            name: filter.name?.toLowerCase(),
            status: filter.status?.toLowerCase(),
            species: filter.species?.toLowerCase(),
            gender: filter.gender?.toLowerCase(),
            origin: filter.origin?.toLowerCase()
        };
        return this.data.filter(c => {
            const nameOk = !f.name || c.name.toLowerCase().includes(f.name);
            const statusOk = !f.status || c.status.toLowerCase() === f.status;
            const speciesOk = !f.species || c.species.toLowerCase().includes(f.species);
            const genderOk = !f.gender || c.gender.toLowerCase() === f.gender;
            const originOk = !f.origin || c.origin.toLowerCase().includes(f.origin);
            return nameOk && statusOk && speciesOk && genderOk && originOk;
        });
    }
}

const SAMPLE: Character[] = [
    { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', gender: 'Male', origin: 'Earth (C-137)' },
    { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', gender: 'Male', origin: 'Earth (C-137)' },
    { id: 3, name: 'Birdperson', status: 'unknown', species: 'Bird-Person', gender: 'Male', origin: 'Bird World' }
];

describe('CharacterService.search', () => {
    it('devuelve todo sin filtro y delega al repo', async () => {
        const repo = new FakeRepo(SAMPLE);
        const spy = vi.spyOn(repo, 'search');
        const svc = new CharacterService(repo);

        const res = await svc.search({});
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({});
        expect(res.length).toBe(3);
    });

    it('filtra por species + origin de forma case-insensitive (contains)', async () => {
        const svc = new CharacterService(new FakeRepo(SAMPLE));
        const res = await svc.search({ species: 'human', origin: 'earth' });
        expect(res.map(r => r.name)).toEqual(['Rick Sanchez', 'Morty Smith']);
    });

    it('filtra por status/gender con igualdad CI', async () => {
        const svc = new CharacterService(new FakeRepo(SAMPLE));
        const res = await svc.search({ status: 'UNKNOWN', gender: 'male' });
        expect(res.map(r => r.name)).toEqual(['Birdperson']);
    });
});
