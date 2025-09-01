import { Router } from 'express';
import { z } from 'zod';
import { CharacterService as ImplService } from '../../application/character.service';
import { SequelizeCharacterRepository } from '../../infrastructure/sequelizeCharacter.repository';
import { CachedCharacterRepository } from '../../infrastructure/cachedCharacter.repository';
import { characterSyncService } from '../../application/character.sync';
import { env } from '../../../../config/env';

import { UpstreamHttpError } from '../../../../shared/http/upstream-error';

const router = Router();

// Instanciamos Service con Repo cacheado 
const baseRepo = new SequelizeCharacterRepository();
const cachedRepo = new CachedCharacterRepository(baseRepo);
const service = new ImplService(cachedRepo);

const querySchema = z.object({
    name: z.string().trim().min(1).optional(),
    status: z.string().trim().min(1).optional(),
    species: z.string().trim().min(1).optional(),
    gender: z.string().trim().min(1).optional(),
    origin: z.string().trim().min(1).optional()
});

/**
 * @openapi
 * /api/characters:
 *   get:
 *     summary: Buscar personajes
 *     description: |
 *       Devuelve una lista de personajes filtrando por `name`, `status`, `species`, `gender`, `origin`.  
 *       La búsqueda usa Postgres/Sequelize y cache Redis (TTL configurable por `CACHE_TTL_SECONDS`).
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: Nombre (contiene, case-insensitive)
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *         description: Alive | Dead | unknown (igualdad case-insensitive)
 *       - in: query
 *         name: species
 *         schema: { type: string }
 *         description: Especie (contiene, case-insensitive)
 *       - in: query
 *         name: gender
 *         schema: { type: string }
 *         description: Male | Female | Genderless | unknown (igualdad case-insensitive)
 *       - in: query
 *         name: origin
 *         schema: { type: string }
 *         description: Origen (contiene, case-insensitive)
 *     responses:
 *       200:
 *         description: Lista de personajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Character'
 *       400:
 *         description: Error de validación de parámetros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res) => {
    try {
        const parse = querySchema.safeParse(req.query);
        if (!parse.success) {
            return res.status(400).json({ message: 'Invalid query params', issues: parse.error.flatten() });
        }
        const data = await service.search(parse.data);
        return res.json(data);
    } catch (err: any) {
        return res.status(500).json({ message: err?.message ?? 'Internal error' });
    }
});


/**
 * @openapi
 * /api/characters/sync:
 *   post:
 *     summary: Ejecutar sincronización con API pública
 *     description: Requiere header `x-sync-secret` que coincida con `SYNC_SECRET` de entorno.
 *     tags: [Characters]
 *     security:
 *       - SyncSecretHeader: []
 *     parameters:
 *       - in: header
 *         name: x-sync-secret
 *         required: true
 *         schema: { type: string }
 *         description: Secreto para autorización de la sincronización
 *     responses:
 *       200:
 *         description: Resultado de sincronización
 *       401:
 *         description: No autorizado (faltó/incorrecto secreto)
 */
router.post('/sync', async (req, res) => {
    const secret = req.headers['x-sync-secret'];
    if (!env.syncSecret || secret !== env.syncSecret) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const result = await characterSyncService.syncAll();
        return res.json(result);
    } catch (err: any) {
        if (err instanceof UpstreamHttpError) {
            const s = err.status;
            const msg = err.message || 'Upstream error';
            if (s === 504) return res.status(504).json({ message: msg });
            if (s === 503) return res.status(503).json({ message: msg });
            if (s === 502) return res.status(502).json({ message: msg });
            if (s === 429) return res.status(429).json({ message: 'Rate limited by upstream' });
            return res.status(502).json({ message: msg });
        }
        return res.status(500).json({ message: err?.message ?? 'Internal error' });
    }
});
export default router;
