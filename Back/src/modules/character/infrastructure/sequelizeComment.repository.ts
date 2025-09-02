import { CommentModel } from './sequelizeComment.model';
import type { Comment, CommentRepository } from '../domain/comment.entity';

export class SequelizeCommentRepository implements CommentRepository {
    async add(characterId: number, content: string): Promise<Comment> {
        const row = await CommentModel.create({ character_id: characterId, content });
        return { id: row.id, characterId, content: row.content, createdAt: (row.created_at ?? new Date()).toISOString() };
    }
    async listByCharacter(characterId: number): Promise<Comment[]> {
        const rows = await CommentModel.findAll({ where: { character_id: characterId }, order: [['id', 'ASC']], raw: true });
        return rows.map((r: any) => ({ id: r.id, characterId: r.character_id, content: r.content, createdAt: new Date(r.created_at).toISOString() }));
    }
}
