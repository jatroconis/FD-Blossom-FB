'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('characters', 'deleted_at', {
            type: Sequelize.DATE, allowNull: true
        });

        // Tabla de favoritos (único por character_id)
        await queryInterface.createTable('favorites', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            character_id: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'characters', key: 'id' }, onDelete: 'CASCADE'
            },
            is_favorite: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
        });
        await queryInterface.addConstraint('favorites', { fields: ['character_id'], type: 'unique', name: 'uq_favorites_character' });

        // Tabla de comentarios
        await queryInterface.createTable('comments', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            character_id: {
                type: Sequelize.INTEGER, allowNull: false,
                references: { model: 'characters', key: 'id' }, onDelete: 'CASCADE'
            },
            content: { type: Sequelize.TEXT, allowNull: false },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
        });
        await queryInterface.addIndex('comments', ['character_id']);
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('characters', 'deleted_at');
        await queryInterface.dropTable('comments');
        await queryInterface.dropTable('favorites');
    }
};
