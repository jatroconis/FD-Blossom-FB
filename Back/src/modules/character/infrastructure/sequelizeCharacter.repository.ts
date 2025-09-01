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
        if (filter.status) where.status = { [Op.iLike]: `${filter.status}` };   // igualdad CI
        if (filter.species) where.species = { [Op.iLike]: `%${filter.species}%` };
        if (filter.gender) where.gender = { [Op.iLike]: `${filter.gender}` };   // igualdad CI
        if (filter.origin) where.origin = { [Op.iLike]: `%${filter.origin}%` };

        const rows = await CharacterModel.findAll({
            where,
            limit: 100,
            order: [['id', 'ASC']],
            raw: true
        });

        // (id obligatorio como number)
        const mapped: Character[] = rows
            .map((r: any) => ({
                id: Number(r.id),
                name: String(r.name ?? ''),
                status: String(r.status ?? ''),
                species: String(r.species ?? ''),
                gender: String(r.gender ?? ''),
                origin: String(r.origin ?? ''),
                image: r.image ?? undefined,
                created: r.created_api ?? undefined
            }))
            .filter(c => Number.isFinite(c.id));

        return mapped;
    }
}
