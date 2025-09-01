import { connectRedis } from './redisClient';
// import { logger } from '../logger'; // úsalo si quieres loguear borrados

export async function cacheGet<T>(key: string): Promise<T | null> {
    const client = await connectRedis();
    const raw = await client.get(key);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; } catch { return null; }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const client = await connectRedis();
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
}

export async function cacheDel(keyPattern: string): Promise<number> {
    const client = await connectRedis();

    let total = 0;
    const batch: string[] = [];

    // Itera las llaves que matchean el patrón
    for await (const key of client.scanIterator({ MATCH: keyPattern, COUNT: 200 })) {
        batch.push(String(key));

        if (batch.length >= 200) {
            const results = await Promise.all(batch.map(k => client.del(k)));
            total += results.reduce((acc, n) => acc + n, 0);
            batch.length = 0;
        }
    }

    if (batch.length) {
        const results = await Promise.all(batch.map(k => client.del(k)));
        total += results.reduce((acc, n) => acc + n, 0);
    }

    return total;
}