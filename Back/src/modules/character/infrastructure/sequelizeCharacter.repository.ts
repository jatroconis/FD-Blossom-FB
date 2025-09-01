import { Op } from 'sequelize';
import type { CharacterRepository } from '../domain/character.repository';
import type { Character } from '../domain/character.entity';
import { CharacterModel } from './sequelizeCharacter.model';
import { FavoriteModel } from './sequelizeFavorite.model';

export class SequelizeCharacterRepository implements CharacterRepository {
    async search(filter: {
        name?: string; status?: string; species?: string; gender?: string; origin?: string; favorite?: boolean;
    }): Promise<Character[]> {
        const where: any = { deleted_at: null };

        if (filter.name) where.name = { [Op.iLike]: `%${filter.name}%` };
        if (filter.status) where.status = { [Op.iLike]: `${filter.status}` };
        if (filter.species) where.species = { [Op.iLike]: `%${filter.species}%` };
        if (filter.gender) where.gender = { [Op.iLike]: `${filter.gender}` };
        if (filter.origin) where.origin = { [Op.iLike]: `%${filter.origin}%` };

        const rows = await CharacterModel.findAll({
            where, limit: 100, order: [['id', 'ASC']], raw: true
        });

        // ids favoritos
        const favIds = new Set<number>(
            (await FavoriteModel.findAll({
                where: { is_favorite: true }, attributes: ['character_id'], raw: true
            })).map((r: any) => Number(r.character_id))
        );

        // map filtro por favorite
        let mapped: Character[] = rows.map((r: any) => ({
            id: Number(r.id),
            name: String(r.name ?? ''),
            status: String(r.status ?? ''),
            species: String(r.species ?? ''),
            gender: String(r.gender ?? ''),
            origin: String(r.origin ?? ''),
            image: r.image ?? undefined,
            created: r.created_api ?? undefined,
            isFavorite: favIds.has(Number(r.id)),
            deletedAt: r.deleted_at ? new Date(r.deleted_at).toISOString() : null
        }));

        if (typeof filter.favorite === 'boolean') {
            mapped = mapped.filter(c => Boolean(c.isFavorite) === filter.favorite);
        }

        return mapped;
    }

    async softDelete(id: number): Promise<boolean> { return (Array.isArray(await CharacterModel.update({ deletedAt: new Date() }, { where: { id } })) ? (await CharacterModel.update({ deletedAt: new Date() }, { where: { id } }))[0] : 0) > 0; }
    async restore(id: number): Promise<boolean> { return (Array.isArray(await CharacterModel.update({ deletedAt: null }, { where: { id } })) ? (await CharacterModel.update({ deletedAt: null }, { where: { id } }))[0] : 0) > 0; }
}
