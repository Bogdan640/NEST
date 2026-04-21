import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let validToken: string;
let resourceId: string;

describe('Shed Routes Verification', () => {
  beforeAll(async () => {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'magdalena.potarniche@nest.local',
      password: 'parola123'
    });
    validToken = loginResponse.body.token;

    await prisma.resourceReservation.deleteMany();
    await prisma.resource.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/shed', () => {
    it('creates a community tool', async () => {
      const response = await request(app)
        .post('/api/v1/shed')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Bormasina',
          description: 'Masina de gaurit profesionala',
          type: 'TOOL',
          isCommunityOwned: true
        });
      
      expect(response.status).toBe(201);
      resourceId = response.body.id;
    });
  });

  describe('POST /api/v1/shed/:id/reserve', () => {
    it('reserves an available tool successfully', async () => {
      const startTime = new Date();
      const endTime = new Date(Date.now() + 3600000);

      const response = await request(app)
        .post(`/api/v1/shed/${resourceId}/reserve`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ startTime: startTime.toISOString(), endTime: endTime.toISOString() });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('APPROVED');
    });

    it('rejects booking actively engaged tool', async () => {
      const startTime = new Date();
      const endTime = new Date(Date.now() + 3600000);

      const response = await request(app)
        .post(`/api/v1/shed/${resourceId}/reserve`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ startTime: startTime.toISOString(), endTime: endTime.toISOString() });
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Resource actively engaged elsewhere');
    });

    it('rejects reservation on coolDown', async () => {
      await prisma.resourceReservation.deleteMany();
      await prisma.resourceReservation.create({
        data: {
          resourceId: resourceId,
          borrowerId: (await prisma.user.findFirst())!.id,
          startTime: new Date(Date.now() - 864000000),
          endTime: new Date(),
          status: 'RETURNED'
        }
      });

      const startTime = new Date(Date.now() + 1000);
      const endTime = new Date(Date.now() + 3600000);

      const response = await request(app)
        .post(`/api/v1/shed/${resourceId}/reserve`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ startTime: startTime.toISOString(), endTime: endTime.toISOString() });
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Resource experiencing mandatory cooldown phase');
    });
  });

  describe('Validation & Edge Cases', () => {
    it('fails on missing resource payload', async () => {
      const response = await request(app).post('/api/v1/shed').set('Authorization', `Bearer ${validToken}`).send({});
      expect(response.status).toBe(400);
    });

    it('fails on missing reservation constraints', async () => {
      const response = await request(app).post(`/api/v1/shed/${resourceId}/reserve`).set('Authorization', `Bearer ${validToken}`).send({});
      expect(response.status).toBe(400);
    });

    it('retrieves resources with pagination', async () => {
      const response = await request(app).get('/api/v1/shed').set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeDefined();
    });
  });

  describe('GET /api/v1/shed/:id', () => {
    it('retrieves resource by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/shed/${resourceId}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(resourceId);
    });

    it('returns 404 for non-existent resource', async () => {
      const response = await request(app)
        .get('/api/v1/shed/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/shed/:id/return', () => {
    it('returns a borrowed resource', async () => {
      await prisma.resourceReservation.deleteMany();
      await prisma.resourceReservation.create({
        data: {
          resourceId: resourceId,
          borrowerId: (await prisma.user.findFirst())!.id,
          startTime: new Date(Date.now() - 3600000),
          endTime: new Date(Date.now() + 3600000),
          status: 'APPROVED'
        }
      });

      const response = await request(app)
        .post(`/api/v1/shed/${resourceId}/return`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('RETURNED');
    });

    it('returns 404 when no active reservation', async () => {
      const response = await request(app)
        .post(`/api/v1/shed/${resourceId}/return`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/shed/:id', () => {
    let ownedResourceId: string;

    beforeAll(async () => {
      const createResp = await request(app)
        .post('/api/v1/shed')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'My Personal Drill', description: 'Personal tool', type: 'TOOL', isCommunityOwned: false });
      ownedResourceId = createResp.body.id;
    });

    it('updates own resource', async () => {
      const response = await request(app)
        .put(`/api/v1/shed/${ownedResourceId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Updated Drill', description: 'Updated description' });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Drill');
    });

    it('rejects update with missing fields', async () => {
      const response = await request(app)
        .put(`/api/v1/shed/${ownedResourceId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/shed/:id', () => {
    let deleteResourceId: string;

    beforeAll(async () => {
      const createResp = await request(app)
        .post('/api/v1/shed')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'To Delete', description: 'Will be deleted', type: 'TOOL', isCommunityOwned: false });
      deleteResourceId = createResp.body.id;
    });

    it('deletes own resource', async () => {
      const response = await request(app)
        .delete(`/api/v1/shed/${deleteResourceId}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(204);
    });

    it('returns 404 for already deleted resource', async () => {
      const response = await request(app)
        .delete(`/api/v1/shed/${deleteResourceId}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(404);
    });
  });
});

