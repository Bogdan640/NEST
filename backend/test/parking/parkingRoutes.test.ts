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
      expect(response.body.error).toBe('Already applied for this parking slot');
    });
  });

  describe('POST /api/v1/parking/applications/:applicationId/approve', () => {
    it('rejects approval from non-publisher', async () => {
      const response = await request(app)
        .post(`/api/v1/parking/applications/${executionApplicationId}/approve`)
        .set('Authorization', `Bearer ${dorelToken}`); 
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Only the announcement publisher can approve applications');
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
      expect(blockedApp.body.error).toBe('Parking slot already claimed by another resident');
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

    it('retrieves announcements with pagination', async () => {
      const response = await request(app).get('/api/v1/parking').set('Authorization', `Bearer ${magdalenaToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeDefined();
    });
  });

  describe('GET /api/v1/parking/:id', () => {
    it('retrieves announcement by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/parking/${executionAnnouncementId}`)
        .set('Authorization', `Bearer ${magdalenaToken}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(executionAnnouncementId);
    });

    it('returns 404 for non-existent announcement', async () => {
      const response = await request(app)
        .get('/api/v1/parking/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${magdalenaToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/v1/parking/slots', () => {
    it('retrieves all parking slots', async () => {
      const response = await request(app)
        .get('/api/v1/parking/slots')
        .set('Authorization', `Bearer ${magdalenaToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/v1/parking/slots', () => {
    it('creates a parking slot', async () => {
      const slotId = `SLOT-TEST-${Date.now()}`;
      const response = await request(app)
        .post('/api/v1/parking/slots')
        .set('Authorization', `Bearer ${magdalenaToken}`)
        .send({ identifier: slotId });
      expect(response.status).toBe(201);
      expect(response.body.identifier).toBe(slotId);
    });

    it('rejects duplicate slot identifier', async () => {
      const response = await request(app)
        .post('/api/v1/parking/slots')
        .set('Authorization', `Bearer ${magdalenaToken}`)
        .send({ identifier: 'SLOT-TEST' });
      expect(response.status).toBe(409);
    });

    it('rejects missing identifier', async () => {
      const response = await request(app)
        .post('/api/v1/parking/slots')
        .set('Authorization', `Bearer ${magdalenaToken}`)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/parking/:id', () => {
    it('deletes own announcement', async () => {
      const newAnn = await request(app)
        .post('/api/v1/parking')
        .set('Authorization', `Bearer ${magdalenaToken}`)
        .send({
          parkingSlotId: existingSlotId,
          availableFrom: new Date(Date.now() + 86400000).toISOString(),
          availableTo: new Date(Date.now() + 172800000).toISOString()
        });

      const response = await request(app)
        .delete(`/api/v1/parking/${newAnn.body.id}`)
        .set('Authorization', `Bearer ${magdalenaToken}`);
      expect(response.status).toBe(204);
    });

    it('returns 404 for non-existent announcement', async () => {
      const response = await request(app)
        .delete('/api/v1/parking/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${magdalenaToken}`);
      expect(response.status).toBe(404);
    });
  });
});
