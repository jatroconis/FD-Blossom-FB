import { CharacterService as ImplService } from '../../application/character.service';
import { SequelizeCharacterRepository } from '../../infrastructure/sequelizeCharacter.repository';
import { CachedCharacterRepository } from '../../infrastructure/cachedCharacter.repository';

const baseRepo = new SequelizeCharacterRepository();
const cachedRepo = new CachedCharacterRepository(baseRepo);
const service = new ImplService(cachedRepo);

export const resolvers = {
    Query: {
        ping: () => 'pong',
        characters: async (_: unknown, args: {
            filter?: {
                name?: string; status?: string; species?: string; gender?: string; origin?: string;
            }
        }) => {
            return service.search(args.filter ?? {});
        }
    }
};
