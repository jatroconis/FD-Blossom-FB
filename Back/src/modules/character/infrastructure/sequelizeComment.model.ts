import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../infrastructure/database/sequelize';

interface CommentAttrs { id: number; character_id: number; content: string; created_at?: Date; }
interface CommentCreation extends Optional<CommentAttrs, 'id' | 'created_at'> { }

export class CommentModel extends Model<CommentAttrs, CommentCreation> implements CommentAttrs {
    declare id: number;
    declare character_id: number;
    declare content: string;
    declare created_at?: Date;
}
CommentModel.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    character_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW }
}, {
    sequelize,
    tableName: 'comments',
    underscored: true,
    timestamps: false
});
