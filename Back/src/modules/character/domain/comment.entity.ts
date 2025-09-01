export interface Comment {
    id: number;
    characterId: number;
    content: string;
    createdAt: string;
}
export interface CommentRepository {
    add(characterId: number, content: string): Promise<Comment>;
    listByCharacter(characterId: number): Promise<Comment[]>;
}
