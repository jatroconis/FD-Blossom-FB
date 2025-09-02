'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('characters', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            external_id: { type: Sequelize.INTEGER, allowNull: false, unique: true },
            name: { type: Sequelize.STRING(150), allowNull: false },
            status: { type: Sequelize.STRING(20), allowNull: false },
            species: { type: Sequelize.STRING(80), allowNull: false },
            gender: { type: Sequelize.STRING(20), allowNull: false },
            origin: { type: Sequelize.STRING(120), allowNull: false },
            image: { type: Sequelize.STRING(500) },
            created_api: { type: Sequelize.STRING(40) },
            created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
            updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
        });
        await queryInterface.addIndex('characters', ['name']);
        await queryInterface.addIndex('characters', ['status']);
        await queryInterface.addIndex('characters', ['species']);
        await queryInterface.addIndex('characters', ['gender']);
        await queryInterface.addIndex('characters', ['origin']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('characters');
    }
};
