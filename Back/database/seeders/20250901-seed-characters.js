'use strict';
const axios = require('axios');

module.exports = {
    async up(queryInterface) {
        // Trae los primeros 15 del endpoint de Rick and Morty
        const { data } = await axios.get('https://rickandmortyapi.com/api/character?page=1');
        const items = (data?.results || []).slice(0, 15).map((c) => ({
            external_id: c.id,
            name: c.name,
            status: c.status,
            species: c.species,
            gender: c.gender,
            origin: c.origin?.name || 'unknown',
            image: c.image || null,
            created_api: c.created || null,
            created_at: new Date(),
            updated_at: new Date()
        }));

        if (items.length) {
            await queryInterface.bulkInsert('characters', items, {});
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('characters', null, {});
    }
};
