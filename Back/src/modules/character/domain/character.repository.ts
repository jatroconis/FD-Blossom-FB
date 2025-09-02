import type { Character, CharacterFilter } from './character.entity';

// Contrato de repositorio DIP. Infra lo implementa (Sequelize/Redis).
export interface CharacterRepository {
    search(filter: CharacterFilter): Promise<Character[]>;
    softDelete(id: number): Promise<boolean>;
    restore(id: number): Promise<boolean>;
}
