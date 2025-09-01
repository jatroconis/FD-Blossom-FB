import type { Character, CharacterFilter } from '../domain/character.entity';
import type { CharacterRepository } from '../domain/character.repository';
import { Measure } from '../../../shared/decorators/measure.decorator';

export class CharacterService {
    constructor(private readonly repo: CharacterRepository) { }

    @Measure()
    async search(filter: CharacterFilter): Promise<Character[]> {
        return this.repo.search(filter);
    }
}
