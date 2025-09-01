import { FavoriteModel } from './sequelizeFavorite.model';
import type { FavoriteRepository } from '../domain/favorite.repository';
import { invalidateCharacterSearchCache } from './cacheInvalidation';

export class SequelizeFavoriteRepository implements FavoriteRepository {
    async toggle(characterId: number): Promise<{ characterId: number; isFavorite: boolean }> {
        const existing = await FavoriteModel.findOne({ where: { character_id: characterId } });
        let isFavorite = true;
        if (!existing) {
            await FavoriteModel.create({ character_id: characterId, is_favorite: true });
            isFavorite = true;
        } else {
            isFavorite = !existing.is_favorite;
            existing.is_favorite = isFavorite;
            await existing.save();
        }
        await invalidateCharacterSearchCache();
        return { characterId, isFavorite };
    }

    async listAllIds(): Promise<number[]> {
        const rows = await FavoriteModel.findAll({ where: { is_favorite: true }, attributes: ['character_id'], raw: true });
        return rows.map((r: any) => r.character_id);
    }
}
