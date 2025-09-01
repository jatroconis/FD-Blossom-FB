import cron from 'node-cron';
import { logger } from '../logger';
import { characterSyncService } from '../../modules/character/application/character.sync';
import { env } from '../../config/env';

export function setupCron() {
    if (String(process.env.CRON_ENABLED).toLowerCase() !== 'true') {
        logger.info('Cron disabled');
        return;
    }

    const expr = process.env.CRON_EXPRESSION || '0 */12 * * *';
    const tz = process.env.CRON_TZ || 'America/Bogota';

    logger.info({ msg: 'Cron scheduled', expr, tz });

    const task = cron.schedule(expr, async () => {
        logger.info('Cron: sync start');
        try {
            const res = await characterSyncService.syncAll();
            logger.info({ msg: 'Cron: sync done', ...res });
        } catch (err) {
            logger.error({ err }, 'Cron: sync error');
        }
    }, { timezone: tz });

    if (env.cronEnabled === 'true') {
        (async () => {
            logger.info('Cron: run on start');
            try {
                const res = await characterSyncService.syncAll();
                logger.info({ msg: 'Cron: initial sync done', ...res });
            } catch (err) {
                logger.error({ err }, 'Cron: initial sync error');
            }
        })();
    }

    return task;
}
