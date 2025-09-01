import { cacheDel } from '../../../infrastructure/cache/redisCache';

export async function invalidateCharacterSearchCache() {
    await cacheDel('character:search:*');
}
