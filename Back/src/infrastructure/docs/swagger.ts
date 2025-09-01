import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const pkg = { name: 'rickmorty-api', version: '1.0.0' };

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Rick & Morty API For Blossom –  Backend ',
            version: pkg.version,
            description:
                'REST de búsqueda de personajes. Cache Redis y Sequelize/Postgres por debajo.\n\n' +
                '---\n' +
                '**Contacto Desarollador  :D**:\n' +
                '- Nombre: Juan Andres Troconis Redondo\n' +
                '- Email: jatroconis4@gmail.com\n' +
                '- Teléfono: +57 3105249121\n' +
                '- LinkedIn: https://www.linkedin.com/in/juan-andres-troconis-redondo-16a3a5218/\n',
            contact: {
                name: 'Juan Andres Troconis Redondo',
                email: 'jatroconis4@gmail.com',
                url: 'https://www.linkedin.com/in/juan-andres-troconis-redondo-16a3a5218/'
            },
            'x-phone': '+57 3105249121'
        },
        servers: [{ url: 'http://localhost:4000' }],
        components: {
            schemas: {
                Character: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Rick Sanchez' },
                        status: { type: 'string', example: 'Alive' },
                        species: { type: 'string', example: 'Human' },
                        gender: { type: 'string', example: 'Male' },
                        origin: { type: 'string', example: 'Earth (C-137)' },
                        image: { type: 'string', nullable: true, example: 'https://...' },
                        created: { type: 'string', nullable: true, example: '2017-11-04T18:48:46.250Z' }
                    },
                    required: ['id', 'name', 'status', 'species', 'gender', 'origin']
                },
                CharacterFilter: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        status: { type: 'string' },
                        species: { type: 'string' },
                        gender: { type: 'string' },
                        origin: { type: 'string' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ['src/**/*.route.ts']
};

export function setupSwagger(app: Express) {
    const spec = swaggerJsdoc(options);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
    app.get('/docs.json', (_req, res) => res.json(spec));
}
