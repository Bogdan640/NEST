import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Routes Verification', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/login', () => {
    it('rejects empty payloads', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required credentials');
    });

    it('rejects invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'magdalena.potarniche@nest.local', password: 'wrongpassword' });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('authenticates valid residents successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'magdalena.potarniche@nest.local', password: 'parola123' });
      
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('magdalena.potarniche@nest.local');
    });
  });

  describe('POST /api/v1/auth/register', () => {
    const testEmail = `testuser_${Date.now()}@nest.local`;

    afterAll(async () => {
      await prisma.joinRequest.deleteMany({ where: { user: { email: testEmail } } });
      await prisma.user.deleteMany({ where: { email: testEmail } });
    });

    it('registers a new user', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: testEmail,
        password: 'securPass123',
        firstName: 'Test',
        lastName: 'User',
        apartmentNumber: '99Z'
      });

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user.isVerified).toBe(false);
      expect(response.body.user.blockId).toBeNull();
      expect(response.body.permissions).toEqual([]);
    });

    it('rejects duplicate email', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: testEmail,
        password: 'anotherPass',
        firstName: 'Dup',
        lastName: 'User',
        apartmentNumber: '1A'
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Email already registered');
    });

    it('rejects missing fields', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({ email: 'missing@fields.com' });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/join-block', () => {
    const joinEmail = `jointest_${Date.now()}@nest.local`;
    let newUserToken: string;

    beforeAll(async () => {
      const regResp = await request(app).post('/api/v1/auth/register').send({
        email: joinEmail, password: 'pass123', firstName: 'Join', lastName: 'Tester', apartmentNumber: '77A'
      });
      newUserToken = regResp.body.token;
    });

    afterAll(async () => {
      await prisma.joinRequest.deleteMany({ where: { user: { email: joinEmail } } });
      await prisma.user.deleteMany({ where: { email: joinEmail } });
    });

    it('rejects invalid block code', async () => {
      const response = await request(app)
        .post('/api/v1/auth/join-block')
        .set('Authorization', `Bearer ${newUserToken}`)
        .send({ blockCode: 'INVALID-CODE-999' });
      expect(response.status).toBe(409);
    });

    it('submits join request with valid code', async () => {
      const response = await request(app)
        .post('/api/v1/auth/join-block')
        .set('Authorization', `Bearer ${newUserToken}`)
        .send({ blockCode: 'NEST-BLOC-A1' });
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('PENDING');
    });

    it('rejects duplicate join request', async () => {
      const response = await request(app)
        .post('/api/v1/auth/join-block')
        .set('Authorization', `Bearer ${newUserToken}`)
        .send({ blockCode: 'NEST-BLOC-A1' });
      expect(response.status).toBe(409);
    });

    it('rejects missing block code', async () => {
      const response = await request(app)
        .post('/api/v1/auth/join-block')
        .set('Authorization', `Bearer ${newUserToken}`)
        .send({});
      expect(response.status).toBe(400);
    });

    it('rejects without auth', async () => {
      const response = await request(app).post('/api/v1/auth/join-block').send({ blockCode: 'NEST-BLOC-A1' });
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/permissions', () => {
    it('returns permissions for admin', async () => {
      const loginResp = await request(app).post('/api/v1/auth/login').send({
        email: 'marius.scrum@nest.local', password: 'parola123'
      });
      const response = await request(app)
        .get('/api/v1/auth/permissions')
        .set('Authorization', `Bearer ${loginResp.body.token}`);
      expect(response.status).toBe(200);
      expect(response.body.role).toBe('ADMIN');
      expect(response.body.permissions).toContain('manage_users');
    });

    it('returns empty permissions for resident', async () => {
      const loginResp = await request(app).post('/api/v1/auth/login').send({
        email: 'magdalena.potarniche@nest.local', password: 'parola123'
      });
      const response = await request(app)
        .get('/api/v1/auth/permissions')
        .set('Authorization', `Bearer ${loginResp.body.token}`);
      expect(response.status).toBe(200);
      expect(response.body.role).toBe('RESIDENT');
      expect(response.body.permissions).toEqual([]);
    });

    it('rejects without auth', async () => {
      const response = await request(app).get('/api/v1/auth/permissions');
      expect(response.status).toBe(401);
    });
  });

  describe('Login response format', () => {
    it('includes permissions in login response', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'marius.scrum@nest.local', password: 'parola123'
      });
      expect(response.status).toBe(200);
      expect(response.body.permissions).toBeDefined();
      expect(Array.isArray(response.body.permissions)).toBe(true);
      expect(response.body.user.role).toBe('ADMIN');
      expect(response.body.user.isVerified).toBeDefined();
      expect(response.body.user.blockId).toBeDefined();
    });
  });
});
