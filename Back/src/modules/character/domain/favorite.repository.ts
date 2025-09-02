export interface FavoriteRepository {
    toggle(characterId: number): Promise<{ characterId: number; isFavorite: boolean }>;
    listAllIds(): Promise<number[]>;
}