import { Op } from 'sequelize';
import type { CharacterRepository } from '../domain/character.repository';
import type { Character } from '../domain/character.entity';
import { CharacterModel } from './sequelizeCharacter.model';

export class SequelizeCharacterRepository implements CharacterRepository {
    async search(filter: {
        name?: string; status?: string; species?: string; gender?: string; origin?: string;
    }): Promise<Character[]> {
        const where: any = {};
        if (filter.name) where.name = { [Op.iLike]: `%${filter.name}%` };
        if (filter.status) where.status = filter.status;
        if (filter.species) where.species = { [Op.iLike]: `%${filter.species}%` };
        if (filter.gender) where.gender = filter.gender;
        if (filter.origin) where.origin = { [Op.iLike]: `%${filter.origin}%` };

        const rows = await CharacterModel.findAll({ where, limit: 100, order: [['id', 'ASC']] });
        return rows.map(r => ({
            id: r.id,
            name: r.name,
            status: r.status,
            species: r.species,
            gender: r.gender,
            origin: r.origin,
            image: r.image ?? undefined,
            created: r.created_api ?? undefined
        }));
    }
}
