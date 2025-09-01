import { CharacterModel } from '../infrastructure/sequelizeCharacter.model';
import { fetchCharactersPage } from '../infrastructure/rmApi.client';
import { invalidateCharacterSearchCache } from '../infrastructure/cacheInvalidation';

export interface SyncResult {
    pagesFetched: number;
    rowsUpserted: number;
}

export class CharacterSyncService {
    private isRunning = false;

    async syncAll(): Promise<SyncResult> {
        if (this.isRunning) return { pagesFetched: 0, rowsUpserted: 0 };
        this.isRunning = true;
        try {
            let page = 1;
            let pagesFetched = 0;
            let rowsUpserted = 0;

            while (true) {
                const { results, info } = await fetchCharactersPage(page);
                pagesFetched++;
                if (results?.length) {
                    const rows = results.map((c) => ({
                        external_id: c.id,
                        name: c.name,
                        status: c.status,
                        species: c.species,
                        gender: c.gender,
                        origin: c.origin?.name ?? 'unknown',
                        image: c.image ?? null,
                        created_api: c.created ?? null,
                        updatedAt: new Date()
                    }));
                    await CharacterModel.bulkCreate(rows, {
                        updateOnDuplicate: ['name', 'status', 'species', 'gender', 'origin', 'image', 'created_api', 'updatedAt']
                    });
                    rowsUpserted += rows.length;
                }
                if (!info?.next) break;
                page++;
            }

            // Después de sincronizar, invalida la caché de búsquedas
            await invalidateCharacterSearchCache();

            return { pagesFetched, rowsUpserted };
        } finally {
            this.isRunning = false;
        }
    }
}

// Singleton sencillo para reusar en cron y endpoint
export const characterSyncService = new CharacterSyncService();
