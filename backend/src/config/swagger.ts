import swaggerUi from 'swagger-ui-express';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NEST Community API',
    version: '1.0.0',
    description: 'API documentation for the NEST web application'
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {}
};

export const swaggerSetup = swaggerUi.setup(swaggerDocument);
export const swaggerServe = swaggerUi.serve;
