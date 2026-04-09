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
      // add some time so it falls into actively engaged constraint correctly
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
          startTime: new Date(Date.now() - 86400000), // borrowed 1 day ago
          endTime: new Date(Date.now() - 3600000),    // returned 1 hour ago
          status: 'RETURNED'
        }
      });
      // Cooldown will be 23 hours / 24 =~ 57 minutes roughly, plus it was returned 1 hour ago?
      // Wait, borrowedDurationMs is 23 hours. cooldownMs = 23/24 = 57 minutes.
      // So cooldownExpiration = updatedAt + 57 min. 
      // If it was returned 1 hour ago, cooldown is expired!
      // Let's make it returned strictly 1 minute ago.
      await prisma.resourceReservation.deleteMany();
      await prisma.resourceReservation.create({
        data: {
          resourceId: resourceId,
          borrowerId: (await prisma.user.findFirst())!.id,
          startTime: new Date(Date.now() - 864000000), // borrowed 10 days ago
          endTime: new Date(),    // returned now
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

    it('retrieves resources happily', async () => {
      const response = await request(app).get('/api/v1/shed').set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
