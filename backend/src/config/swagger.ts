import swaggerUi from 'swagger-ui-express';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NEST Community API',
    version: '1.0.0',
    description: 'API documentation for the NEST internal localized web application'
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Log in heavily to retrieve the Bearer.'
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        summary: 'Authenticate User',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'magdalena.potarniche@nest.local' },
                  password: { type: 'string', example: 'parola123' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Successful login returning extensive JWT parameter payload' },
          401: { description: 'Missing or strictly invalid user parameters' }
        }
      }
    },
    '/feed': {
      get: {
        summary: 'Retrieve global chronological feed',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Retrieves all locally mapped platform posts' } }
      },
      post: {
        summary: 'Publish strict daily post',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { content: { type: 'string', example: 'Buna dimineata tuturor vecinilor de pe scara!' } } }
            }
          }
        },
        responses: {
          201: { description: 'Post dynamically committed securely' },
          400: { description: 'Missing payload logic constraints' },
          429: { description: 'Resident critically exceeded global 1-per-day post volume limits' }
        }
      }
    },
    '/feed/{id}': {
      get: {
        summary: 'Retrieve targeted Feed Post',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Target post dynamically extracted' }, 404: { description: 'Post physically untraceable' } }
      },
      put: {
        summary: 'Update your Feed Post dynamically',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: '123' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { content: { type: 'string', example: 'Edited message' } } } } }
        },
        responses: { 200: { description: 'Post edited successfully' }, 403: { description: 'Unauthorized jurisdiction' } }
      },
      delete: {
        summary: 'Delete Feed Post',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: '123' } }],
        responses: { 204: { description: 'Wiped structurally' }, 403: { description: 'Unauthorized jurisdiction' } }
      }
    },
    '/events': {
      get: {
        summary: 'Retrieve all dynamic community events',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Extracts entire localized event boundaries' } }
      },
      post: {
        summary: 'Execute a new Event hosting',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Sedinta asociatia de proprietari' },
                  description: { type: 'string', example: 'Votare cheltuieli lunare fațadă scara A.' },
                  location: { type: 'string', example: 'Hol Parter' },
                  type: { type: 'string', example: 'WORK' },
                  startTime: { type: 'string', format: 'date-time' },
                  endTime: { type: 'string', format: 'date-time' },
                  maxParticipants: { type: 'integer', example: 50 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Event hosted perfectly' },
          400: { description: 'Missing event structures natively' }
        }
      }
    },
    '/events/{id}/join': {
      post: {
        summary: 'Join specified target Event',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: '123e4567-e89b-12d3' } }],
        responses: { 200: { description: 'Succesfully mapped into the attendees list' }, 409: { description: 'Resident blocked' } }
      }
    },
    '/events/{id}': {
      get: {
        summary: 'Retrieve targeted Community Event strictly',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Event dynamically extracted' }, 404: { description: 'Event physically untraceable' } }
      },
      put: {
        summary: 'Update Event attributes explicitly',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Update complete' }, 403: { description: 'Unauthorized' } }
      },
      delete: {
        summary: 'Delete Native Event',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Structurally Wiped' }, 403: { description: 'Unauthorized' } }
      }
    },
    '/shed': {
      get: {
        summary: 'Fetch all Shed library components',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Returns all internal mapped resources' } }
      },
      post: {
        summary: 'Inject new internal tool/book boundary',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Masina de gaurit rotopercutoare' },
                  description: { type: 'string', example: 'Disponibila oricand pe baza the aprobare' },
                  type: { type: 'string', example: 'TOOL' },
                  isCommunityOwned: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Item structurally committed' } }
      }
    },
    '/shed/{id}/reserve': {
      post: {
        summary: 'Reserve internal resource boundary temporally',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: '123e4567-e89b-12d3' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { startTime: { type: 'string', format: 'date-time' }, endTime: { type: 'string', format: 'date-time' } } } } }
        },
        responses: { 200: { description: 'Structurally approved booking entirely' }, 409: { description: 'Critically blocked by cooldown phase logic natively, or resource actively engaged' } }
      }
    },
    '/shed/{id}': {
      get: {
        summary: 'Retrieve targeted Target Tool Component safely',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Resource dynamically extracted' }, 404: { description: 'Resource physically untraceable' } }
      },
      put: {
        summary: 'Update existing Shed Tool explicitly',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Update complete' }, 403: { description: 'Unauthorized' } }
      },
      delete: {
        summary: 'Delete Native Shed Tool',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Structurally Wiped' }, 403: { description: 'Unauthorized' } }
      }
    },
    '/parking': {
      get: {
        summary: 'Extract current global parking slot availability announcements',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Returns all mapped valid slots locally' } }
      },
      post: {
        summary: 'Execute a parking spot vacancy',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  parkingSlotId: { type: 'string', example: '123e4567-e89b-12d3' },
                  availableFrom: { type: 'string', format: 'date-time' },
                  availableTo: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: { 201: { description: '1to1 target announcement created internally' } }
      }
    },
    '/parking/{id}/apply': {
      post: {
        summary: 'Apply directly for target announcement',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', example: '123e4567-e89b-12d3' } }
        ],
        responses: {
          200: { description: 'Applied cleanly entirely' },
          409: { description: 'Parking effectively claimed securely, or duplicated internal application blocked logically' }
        }
      }
    },
    '/parking/applications/{applicationId}/approve': {
      post: {
        summary: 'Approve specific singular parking target locally locking it entirely',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'applicationId', in: 'path', required: true, schema: { type: 'string', example: '123e4567-e89b-12d3' } }
        ],
        responses: {
          200: { description: 'Exclusively matches the applicant overriding others exactly mapped' },
          403: { description: 'Strictly denied internal auth routing mapping logic' },
          409: { description: 'Denial natively tracking that slot was already successfully allocated elsewhere' }
        }
      }
    },
    '/parking/{id}': {
      get: {
        summary: 'Retrieve targeted Parking Target Announcement exactly',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Announcement dynamically extracted' }, 404: { description: 'Announcement physically untraceable' } }
      },
      delete: {
        summary: 'Delete Parking Announcement',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Announcement Structurally Wiped' }, 403: { description: 'Unauthorized' } }
      }
    }
  }
};

export const swaggerSetup = swaggerUi.setup(swaggerDocument);
export const swaggerServe = swaggerUi.serve;
