import { CharacterService as ImplService } from '../../application/character.service';
import { SequelizeCharacterRepository } from '../../infrastructure/sequelizeCharacter.repository';
import { CachedCharacterRepository } from '../../infrastructure/cachedCharacter.repository';

import { FavoriteService } from '../../application/favorite.service';
import { SequelizeFavoriteRepository } from '../../infrastructure/sequelizeFavorite.repository';

import { CommentService } from '../../application/comment.service';
import { SequelizeCommentRepository } from '../../infrastructure/sequelizeComment.repository';

import { CharacterModel } from '../../infrastructure/sequelizeCharacter.model';

const baseRepo = new SequelizeCharacterRepository();
const cachedRepo = new CachedCharacterRepository(baseRepo);
const service = new ImplService(cachedRepo);

const favSvc = new FavoriteService(new SequelizeFavoriteRepository());
const cmtSvc = new CommentService(new SequelizeCommentRepository());

export const resolvers = {
    Query: {
        ping: () => 'pong',
        characters: (_: unknown, args: { filter?: any }) => service.search(args.filter ?? {}),
        favoriteCharacters: () => service.search({ favorite: true }),  // ← nuevo
        comments: (_: unknown, { characterId }: { characterId: number }) => cmtSvc.listByCharacter(characterId)
    },
    Mutation: {
        toggleFavorite: (_: unknown, { characterId }: { characterId: number }) => favSvc.toggle(characterId),
        addComment: (_: unknown, { characterId, content }: { characterId: number; content: string }) => cmtSvc.add(characterId, content),
        softDeleteCharacter: async (_: unknown, { id }: { id: number }) => {
            const n = await CharacterModel.update({ deletedAt: new Date() }, { where: { id } });
            return (Array.isArray(n) ? n[0] : n) > 0;
        },
        restoreCharacter: async (_: unknown, { id }: { id: number }) => {
            const n = await CharacterModel.update({ deletedAt: null }, { where: { id } });
            return (Array.isArray(n) ? n[0] : n) > 0;
        }
    }
};
