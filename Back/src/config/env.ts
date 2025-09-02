import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

const parentEnv = path.resolve(process.cwd(), '..', '.env');
if (fs.existsSync(parentEnv)) {
    dotenv.config({ path: parentEnv, override: false });
}

export const env = {
    port: Number(process.env.PORT ?? 4000),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    syncSecret: process.env.SYNC_SECRET ?? '',
    cronEnabled: process.env.CRON_ENABLED ?? 'false'
};
