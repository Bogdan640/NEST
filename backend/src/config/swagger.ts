import swaggerUi from 'swagger-ui-express';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NEST Community API',
    version: '2.0.0',
    description: 'API documentation for the NEST internal localized web application'
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Login to retrieve the Bearer token.'
      }
    },
    parameters: {
      pageParam: { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
      limitParam: { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
      searchParam: { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search keyword' },
      sortByParam: { name: 'sortBy', in: 'query', schema: { type: 'string' }, description: 'Field to sort by' },
      sortOrderParam: { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] }, description: 'Sort order' }
    }
  },
  paths: {
    // ===================== AUTH =====================
    '/auth/login': {
      post: {
        summary: 'Login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } }
        },
        responses: {
          200: { description: 'Login successful — returns token, user, and permissions' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/register': {
      post: {
        summary: 'Register new resident',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['email', 'password', 'firstName', 'lastName', 'apartmentNumber'], properties: { email: { type: 'string' }, password: { type: 'string' }, firstName: { type: 'string' }, lastName: { type: 'string' }, apartmentNumber: { type: 'string' } } } } }
        },
        responses: {
          201: { description: 'Registration successful — returns token and user (isVerified: false)' },
          409: { description: 'Email already registered' }
        }
      }
    },
    '/auth/join-block': {
      post: {
        summary: 'Submit block join request',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['blockCode'], properties: { blockCode: { type: 'string' } } } } }
        },
        responses: {
          200: { description: 'Join request created — pending admin approval' },
          409: { description: 'Invalid code or request already submitted' }
        }
      }
    },
    '/auth/permissions': {
      get: {
        summary: 'Get current user permissions',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Returns role and permissions array' }
        }
      }
    },

    // ===================== USERS =====================
    '/users/me': {
      get: {
        summary: 'Get current user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Full user profile' } }
      },
      put: {
        summary: 'Update current user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { firstName: { type: 'string' }, lastName: { type: 'string' }, phoneNumber: { type: 'string' }, headline: { type: 'string' }, about: { type: 'string' }, profileImage: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Updated profile' } }
      }
    },
    '/users/me/preferences': {
      put: {
        summary: 'Update user preferences',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { theme: { type: 'string', enum: ['light', 'dark'] }, isPhonePublic: { type: 'boolean' } } } } }
        },
        responses: { 200: { description: 'Updated preferences' } }
      }
    },
    '/users/{id}': {
      get: {
        summary: 'Get public user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Public profile data' }, 404: { description: 'User not found' } }
      }
    },

    // ===================== ADMIN =====================
    '/admin/pending-users': {
      get: {
        summary: 'Get pending join requests (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of pending join requests' }, 403: { description: 'Not an admin' } }
      }
    },
    '/admin/users/{userId}/approve': {
      post: {
        summary: 'Approve a user join request (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['joinRequestId'], properties: { joinRequestId: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'User approved and verified' }, 403: { description: 'Not authorized' } }
      }
    },
    '/admin/users/{userId}/reject': {
      post: {
        summary: 'Reject a user join request (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['joinRequestId'], properties: { joinRequestId: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Join request rejected' }, 403: { description: 'Not authorized' } }
      }
    },
    '/admin/users/{userId}': {
      delete: {
        summary: 'Remove a user from block (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User removed from block' }, 403: { description: 'Not authorized' } }
      }
    },

    // ===================== FEED =====================
    '/feed': {
      get: {
        summary: 'Get all posts (paginated)',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/pageParam' },
          { $ref: '#/components/parameters/limitParam' },
          { $ref: '#/components/parameters/searchParam' },
          { $ref: '#/components/parameters/sortByParam' },
          { $ref: '#/components/parameters/sortOrderParam' }
        ],
        responses: { 200: { description: 'Paginated list of posts: { data, total, page, limit }' } }
      },
      post: {
        summary: 'Create a post',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['content'], properties: { content: { type: 'string' }, imageUrl: { type: 'string' } } } } }
        },
        responses: { 201: { description: 'Post created' }, 429: { description: 'Daily post limit exceeded' } }
      }
    },
    '/feed/{id}': {
      get: {
        summary: 'Get post by ID',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Post data' }, 404: { description: 'Not found' } }
      },
      put: {
        summary: 'Update a post (owner or admin)',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['content'], properties: { content: { type: 'string' } } } } } },
        responses: { 200: { description: 'Post updated' }, 403: { description: 'Not authorized' }, 404: { description: 'Not found' } }
      },
      delete: {
        summary: 'Delete a post (owner or admin)',
        tags: ['Feed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Deleted' }, 403: { description: 'Not authorized' } }
      }
    },

    // ===================== EVENTS =====================
    '/events': {
      get: {
        summary: 'Get all events (paginated)',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/pageParam' },
          { $ref: '#/components/parameters/limitParam' },
          { $ref: '#/components/parameters/searchParam' },
          { $ref: '#/components/parameters/sortByParam' },
          { $ref: '#/components/parameters/sortOrderParam' }
        ],
        responses: { 200: { description: 'Paginated list of events' } }
      },
      post: {
        summary: 'Create an event',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['title', 'description', 'location', 'type', 'startTime', 'endTime'], properties: { title: { type: 'string' }, description: { type: 'string' }, location: { type: 'string' }, type: { type: 'string', enum: ['MEETING', 'SOCIAL', 'MAINTENANCE', 'OTHER'] }, startTime: { type: 'string', format: 'date-time' }, endTime: { type: 'string', format: 'date-time' }, maxParticipants: { type: 'integer' }, visibility: { type: 'string', enum: ['ALL', 'BUILDING', 'FLOOR'] } } } } }
        },
        responses: { 201: { description: 'Event created' } }
      }
    },
    '/events/{id}': {
      get: {
        summary: 'Get event by ID',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Event data with attendees' }, 404: { description: 'Not found' } }
      },
      put: {
        summary: 'Update an event (creator or admin)',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['title', 'description'], properties: { title: { type: 'string' }, description: { type: 'string' } } } } } },
        responses: { 200: { description: 'Event updated' }, 403: { description: 'Not authorized' } }
      },
      delete: {
        summary: 'Delete an event (creator or admin)',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Event deleted' }, 403: { description: 'Not authorized' } }
      }
    },
    '/events/{id}/join': {
      post: {
        summary: 'Join an event',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Joined event' }, 409: { description: 'Already joined or event full' } }
      }
    },
    '/events/{id}/leave': {
      post: {
        summary: 'Leave an event',
        tags: ['Events'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Left event' }, 404: { description: 'Not attending this event' } }
      }
    },

    // ===================== SHED =====================
    '/shed': {
      get: {
        summary: 'Get all resources (paginated)',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/pageParam' },
          { $ref: '#/components/parameters/limitParam' },
          { $ref: '#/components/parameters/searchParam' },
          { $ref: '#/components/parameters/sortByParam' },
          { $ref: '#/components/parameters/sortOrderParam' }
        ],
        responses: { 200: { description: 'Paginated list of resources' } }
      },
      post: {
        summary: 'Add a resource',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['name', 'description', 'type'], properties: { name: { type: 'string' }, description: { type: 'string' }, type: { type: 'string', enum: ['TOOL', 'BOOK', 'OTHER'] }, isCommunityOwned: { type: 'boolean' } } } } }
        },
        responses: { 201: { description: 'Resource added' } }
      }
    },
    '/shed/{id}': {
      get: {
        summary: 'Get resource by ID',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Resource data with reservations' }, 404: { description: 'Not found' } }
      },
      put: {
        summary: 'Update a resource (owner or admin)',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'description'], properties: { name: { type: 'string' }, description: { type: 'string' } } } } } },
        responses: { 200: { description: 'Resource updated' }, 403: { description: 'Not authorized' } }
      },
      delete: {
        summary: 'Delete a resource (owner or admin)',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Resource deleted' }, 403: { description: 'Not authorized' } }
      }
    },
    '/shed/{id}/reserve': {
      post: {
        summary: 'Reserve a resource',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['startTime', 'endTime'], properties: { startTime: { type: 'string', format: 'date-time' }, endTime: { type: 'string', format: 'date-time' } } } } } },
        responses: { 200: { description: 'Reservation created' }, 409: { description: 'Resource engaged or on cooldown' } }
      }
    },
    '/shed/{id}/return': {
      post: {
        summary: 'Return a borrowed resource',
        tags: ['Shared Shed'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Resource returned, reservation set to RETURNED' }, 404: { description: 'No active reservation found' } }
      }
    },

    // ===================== PARKING =====================
    '/parking': {
      get: {
        summary: 'Get all parking announcements (paginated)',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/pageParam' },
          { $ref: '#/components/parameters/limitParam' },
          { $ref: '#/components/parameters/searchParam' },
          { $ref: '#/components/parameters/sortByParam' },
          { $ref: '#/components/parameters/sortOrderParam' }
        ],
        responses: { 200: { description: 'Paginated list of parking announcements' } }
      },
      post: {
        summary: 'Create parking announcement',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['parkingSlotId', 'availableFrom', 'availableTo'], properties: { parkingSlotId: { type: 'string' }, availableFrom: { type: 'string', format: 'date-time' }, availableTo: { type: 'string', format: 'date-time' } } } } } },
        responses: { 201: { description: 'Announcement created' } }
      }
    },
    '/parking/slots': {
      get: {
        summary: 'Get all parking slots',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of parking slots with owners' } }
      },
      post: {
        summary: 'Create a parking slot',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['identifier'], properties: { identifier: { type: 'string' } } } } } },
        responses: { 201: { description: 'Parking slot created' }, 409: { description: 'Identifier already exists' } }
      }
    },
    '/parking/{id}': {
      get: {
        summary: 'Get announcement by ID',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Announcement data with applications' }, 404: { description: 'Not found' } }
      },
      delete: {
        summary: 'Delete announcement (publisher or admin)',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Deleted' }, 403: { description: 'Not authorized' } }
      }
    },
    '/parking/{id}/apply': {
      post: {
        summary: 'Apply for a parking spot',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Application submitted' }, 409: { description: 'Already applied or slot already claimed' } }
      }
    },
    '/parking/applications/{applicationId}/approve': {
      post: {
        summary: 'Approve a parking application (publisher only)',
        tags: ['Parking'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'applicationId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Application approved, others rejected' }, 403: { description: 'Not the publisher' }, 409: { description: 'Slot already claimed' } }
      }
    }
  }
};

export const swaggerSetup = swaggerUi.setup(swaggerDocument);
export const swaggerServe = swaggerUi.serve;
