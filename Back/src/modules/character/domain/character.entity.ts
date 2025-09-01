// Entidad de dominio (agnóstica de Sequelize/infra)
export interface Character {
    id: number;            // PK interna
    name: string;
    status: string;        // 'Alive' | 'Dead' | 'unknown' 
    species: string;
    gender: string;        // 'Male' | 'Female' | 'Genderless' | 'unknown'
    origin: string;
    image?: string;
    created?: string;      // fecha/origen de la API pública 
    isFavorite?: boolean;
}

// Filtros de búsqueda (reutilizados en Service/Repos)
export interface CharacterFilter {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
    origin?: string;
    favorite?: boolean;
}
