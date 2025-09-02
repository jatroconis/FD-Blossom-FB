import type { CommentRepository, Comment } from '../domain/comment.entity';

export class CommentService {
    constructor(private readonly repo: CommentRepository) { }
    add(characterId: number, content: string): Promise<Comment> { return this.repo.add(characterId, content); }
    listByCharacter(characterId: number): Promise<Comment[]> { return this.repo.listByCharacter(characterId); }
}
