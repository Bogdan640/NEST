import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let adminToken: string;
let residentToken: string;

describe('Admin Routes', () => {
  beforeAll(async () => {
    const adminLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'marius.scrum@nest.local',
      password: 'parola123'
    });
    adminToken = adminLogin.body.token;

    const residentLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'magdalena.potarniche@nest.local',
      password: 'parola123'
    });
    residentToken = residentLogin.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/v1/admin/pending-users', () => {
    it('returns pending users for admin', async () => {
      const response = await request(app)
        .get('/api/v1/admin/pending-users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('rejects non-admin access', async () => {
      const response = await request(app)
        .get('/api/v1/admin/pending-users')
        .set('Authorization', `Bearer ${residentToken}`);

      expect(response.status).toBe(403);
    });

    it('rejects without auth', async () => {
      const response = await request(app).get('/api/v1/admin/pending-users');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/admin/users/:userId/approve', () => {
    it('rejects non-admin', async () => {
      const response = await request(app)
        .post('/api/v1/admin/users/fake-id/approve')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({ joinRequestId: 'fake-request-id' });

      expect(response.status).toBe(403);
    });

    it('rejects missing joinRequestId', async () => {
      const response = await request(app)
        .post('/api/v1/admin/users/fake-id/approve')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('returns 404 for invalid join request', async () => {
      const response = await request(app)
        .post('/api/v1/admin/users/fake-id/approve')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ joinRequestId: '00000000-0000-0000-0000-000000000000' });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/admin/users/:userId/reject', () => {
    it('rejects non-admin', async () => {
      const response = await request(app)
        .post('/api/v1/admin/users/fake-id/reject')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({ joinRequestId: 'fake-request-id' });

      expect(response.status).toBe(403);
    });

    it('returns 404 for invalid join request', async () => {
      const response = await request(app)
        .post('/api/v1/admin/users/fake-id/reject')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ joinRequestId: '00000000-0000-0000-0000-000000000000' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/admin/users/:userId', () => {
    it('rejects non-admin', async () => {
      const response = await request(app)
        .delete('/api/v1/admin/users/fake-id')
        .set('Authorization', `Bearer ${residentToken}`);

      expect(response.status).toBe(403);
    });

    it('returns 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/v1/admin/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('Full approve flow', () => {
    const flowEmail = `flow_${Date.now()}@nest.local`;
    let flowUserId: string;
    let flowJoinRequestId: string;

    afterAll(async () => {
      await prisma.joinRequest.deleteMany({ where: { user: { email: flowEmail } } });
      await prisma.user.deleteMany({ where: { email: flowEmail } });
    });

    it('complete registration → join → approve cycle', async () => {
      const regResp = await request(app).post('/api/v1/auth/register').send({
        email: flowEmail, password: 'pass123', firstName: 'Flow', lastName: 'Test', apartmentNumber: '42X'
      });
      expect(regResp.status).toBe(201);
      const flowToken = regResp.body.token;
      flowUserId = regResp.body.user.id;

      const joinResp = await request(app)
        .post('/api/v1/auth/join-block')
        .set('Authorization', `Bearer ${flowToken}`)
        .send({ blockCode: 'NEST-BLOC-A1' });
      expect(joinResp.status).toBe(200);
      flowJoinRequestId = joinResp.body.id;

      const pendingResp = await request(app)
        .get('/api/v1/admin/pending-users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(pendingResp.status).toBe(200);
      const pendingUser = pendingResp.body.find((r: any) => r.userId === flowUserId);
      expect(pendingUser).toBeDefined();

      const approveResp = await request(app)
        .post(`/api/v1/admin/users/${flowUserId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ joinRequestId: flowJoinRequestId });
      expect(approveResp.status).toBe(200);
      expect(approveResp.body.isVerified).toBe(true);
      expect(approveResp.body.blockId).toBeDefined();
    });
  });
});
