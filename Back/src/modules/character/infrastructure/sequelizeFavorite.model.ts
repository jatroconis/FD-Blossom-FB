import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../infrastructure/database/sequelize'; // tu instancia

export class FavoriteModel extends Model {
    declare id: number;
    declare character_id: number;
    declare is_favorite: boolean;
}
FavoriteModel.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    character_id: { type: DataTypes.INTEGER, allowNull: false },
    is_favorite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize,
    tableName: 'favorites',
    underscored: true,
    timestamps: true
});
