import { Router } from 'express';
import { CharacterModel } from '../../infrastructure/sequelizeCharacter.model';

const router = Router();

router.get('/', async (req, res) => {
    const { name, status, species, gender, origin } = req.query as Record<string, string | undefined>;
    const where: any = {};
    // NOTA: esto es temporal para validación
    if (name) where.name = { $iLike: `%${name}%` };
    if (status) where.status = status;
    if (species) where.species = { $iLike: `%${species}%` };
    if (gender) where.gender = gender;
    if (origin) where.origin = { $iLike: `%${origin}%` };

    const rows = await CharacterModel.findAll({ where, limit: 50, order: [['id', 'ASC']] });
    res.json(rows);
});

export default router;
