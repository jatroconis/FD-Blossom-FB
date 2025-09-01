import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../infrastructure/database/sequelize';

export interface CharacterAttributes {
    id: number;              // PK autoincrement
    external_id: number;     // id de la API pública
    name: string;
    status: string;
    species: string;
    gender: string;
    origin: string;
    image?: string | null;
    created_api?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CharacterCreation = Optional<CharacterAttributes, 'id' | 'image' | 'created_api' | 'createdAt' | 'updatedAt'>;

export class CharacterModel extends Model<CharacterAttributes, CharacterCreation> implements CharacterAttributes {
    public id!: number;
    public external_id!: number;
    public name!: string;
    public status!: string;
    public species!: string;
    public gender!: string;
    public origin!: string;
    public image!: string | null;
    public created_api!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

CharacterModel.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        external_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        status: { type: DataTypes.STRING(20), allowNull: false },
        species: { type: DataTypes.STRING(80), allowNull: false },
        gender: { type: DataTypes.STRING(20), allowNull: false },
        origin: { type: DataTypes.STRING(120), allowNull: false },
        image: { type: DataTypes.STRING(500), allowNull: true },
        created_api: { type: DataTypes.STRING(40), allowNull: true }
    },
    {
        sequelize,
        tableName: 'characters',
        indexes: [
            { fields: ['name'] },
            { fields: ['status'] },
            { fields: ['species'] },
            { fields: ['gender'] },
            { fields: ['origin'] }
        ]
    }
);
