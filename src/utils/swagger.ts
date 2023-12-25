import swaggerjsdoc from 'swagger-jsdoc';
import {version} from '../../package.json';

const options: swaggerjsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'REST API Docs',
            version
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: {
            bearerAuth: [],
        },
    },
    apis: ["./src/routes/*.ts", "./src/schema/*.ts"],
};