import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let magdalenaToken: string;
let dorelToken: string;
let executionAnnouncementId: string;
let executionApplicationId: string;
let existingSlotId: string;

describe('Parking Routes Verification', () => {
  beforeAll(async () => {
    const login1 = await request(app).post('/api/v1/auth/login').send({
      email: 'magdalena.potarniche@nest.local',
      password: 'parola123'
    });
    magdalenaToken = login1.body.token;

    const login2 = await request(app).post('/api/v1/auth/login').send({
      email: 'dorel.mesteru@nest.local',
      password: 'parola123'
    });
    dorelToken = login2.body.token;

    await prisma.parkingApplication.deleteMany();
    await prisma.parkingAnnouncement.deleteMany();

    let slot = await prisma.parkingSlot.findFirst();
    if (!slot) {
      const someUser = await prisma.user.findFirst();
      slot = await prisma.parkingSlot.create({
        data: {
          identifier: 'SLOT-TEST',
          ownerId: someUser!.id
        }
      });
    }
    existingSlotId = slot.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/parking', () => {
    it('creates parking announcement', async () => {
      const response = await request(app)
        .post('/api/v1/parking')
        .set('Authorization', `Bearer ${magdalenaToken}`)
        .send({
          parkingSlotId: existingSlotId,
          availableFrom: new Date().toISOString(),
          availableTo: new Date(Date.now() + 86400000).toISOString()
        });
      
      expect(response.status).toBe(201);
      executionAnnouncementId = response.body.id;
    });
  });

  describe('POST /api/v1/parking/:id/apply', () => {
    it('applies for parking properly', async () => {
      const response = await request(app)
        .post(`/api/v1/parking/${executionAnnouncementId}/apply`)
        .set('Authorization', `Bearer ${dorelToken}`);
      
      expect(response.status).toBe(200);
      executionApplicationId = response.body.id;
    });

    it('rejects duplicated application', async () => {
      const response = await request(app)
        .post(`/api/v1/parking/${executionAnnouncementId}/apply`)
        .set('Authorization', `Bearer ${dorelToken}`);
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Resident heavily duplicated the application');
    });
  });

  describe('POST /api/v1/parking/applications/:applicationId/approve', () => {
    it('rejects approval from non-publisher', async () => {
      const response = await request(app)
        .post(`/api/v1/parking/applications/${executionApplicationId}/approve`)
        .set('Authorization', `Bearer ${dorelToken}`); 
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Unauthorized authorization attempt registered');
    });

    it('approves application exclusively by publisher', async () => {
      const response = await request(app)
        .post(`/api/v1/parking/applications/${executionApplicationId}/approve`)
        .set('Authorization', `Bearer ${magdalenaToken}`); 
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('APPROVED');
    });

    it('rejects secondary approval locking out others', async () => {
      const login3 = await request(app).post('/api/v1/auth/login').send({
        email: 'valeria.trotineta@nest.local',
        password: 'parola123'
      });
      const valeriaToken = login3.body.token;

      const blockedApp = await request(app)
        .post(`/api/v1/parking/${executionAnnouncementId}/apply`)
        .set('Authorization', `Bearer ${valeriaToken}`);

      expect(blockedApp.status).toBe(409);
      expect(blockedApp.body.error).toBe('Parking slot definitively claimed by another resident');
    });
  });

  describe('Validation & Edge Cases', () => {
    it('fails on missing announcement payload', async () => {
      const response = await request(app).post('/api/v1/parking').set('Authorization', `Bearer ${magdalenaToken}`).send({});
      expect(response.status).toBe(400);
    });

    it('fails GET without auth', async () => {
      const response = await request(app).get('/api/v1/parking');
      expect(response.status).toBe(401);
    });

    it('retrieves announcements happily', async () => {
      const response = await request(app).get('/api/v1/parking').set('Authorization', `Bearer ${magdalenaToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
