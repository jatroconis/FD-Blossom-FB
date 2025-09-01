import type { FavoriteRepository } from '../domain/favorite.repository';

export class FavoriteService {
    constructor(private readonly repo: FavoriteRepository) { }
    toggle(characterId: number) { return this.repo.toggle(characterId); }
    listAllIds() { return this.repo.listAllIds(); }
}