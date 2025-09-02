import { CharacterModel } from '../infrastructure/sequelizeCharacter.model';
import { fetchCharactersPage } from '../infrastructure/rmApi.client';
import { invalidateCharacterSearchCache } from '../infrastructure/cacheInvalidation';
import { Measure } from '../../../shared/decorators/measure.decorator';
import { logger } from '../../../infrastructure/logger';
import { isAxiosError } from 'axios';

export interface SyncResult {
    pagesFetched: number;
    rowsUpserted: number;
    pagesFailed: number;
}

export class CharacterSyncService {
    private isRunning = false;

    @Measure()
    async syncAll(): Promise<SyncResult> {
        if (this.isRunning) return { pagesFetched: 0, rowsUpserted: 0, pagesFailed: 0 };
        this.isRunning = true;

        const MAX = Number(process.env.RM_SYNC_MAX_PAGES ?? 0); // 0 = todas
        const IGNORE = String(process.env.RM_SYNC_IGNORE_ERRORS ?? 'true').toLowerCase() === 'true';

        try {
            let page = 1;
            let pagesFetched = 0;
            let pagesFailed = 0;
            let rowsUpserted = 0;

            while (true) {
                if (MAX > 0 && pagesFetched >= MAX) break;

                try {
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
                } catch (err: any) {
                    pagesFailed++;
                    if (isAxiosError(err)) {
                        logger.error({
                            msg: 'Sync page failed',
                            page,
                            status: err.response?.status,
                            statusText: err.response?.statusText,
                            code: err.code
                        });
                    } else {
                        logger.error({ msg: 'Sync page failed', page, err });
                    }

                    if (!IGNORE) throw err;
                    page++;
                }
            }

            await invalidateCharacterSearchCache();

            return { pagesFetched, rowsUpserted, pagesFailed };
        } finally {
            this.isRunning = false;
        }
    }
}

export const characterSyncService = new CharacterSyncService();
