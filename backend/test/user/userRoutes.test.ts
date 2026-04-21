import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let validToken: string;
let userId: string;

describe('User Profile Routes', () => {
  beforeAll(async () => {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'magdalena.potarniche@nest.local',
      password: 'parola123'
    });
    validToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/v1/users/me', () => {
    it('returns own profile', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('magdalena.potarniche@nest.local');
      expect(response.body.firstName).toBe('Magdalena');
      expect(response.body.role).toBeDefined();
      expect(response.body.preferences).toBeDefined();
    });

    it('rejects without auth', async () => {
      const response = await request(app).get('/api/v1/users/me');
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/v1/users/me', () => {
    it('updates profile fields', async () => {
      const response = await request(app)
        .put('/api/v1/users/me')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ headline: 'Vecina prietenoasa', about: 'Imi place comunitatea' });

      expect(response.status).toBe(200);
      expect(response.body.headline).toBe('Vecina prietenoasa');
      expect(response.body.about).toBe('Imi place comunitatea');
    });
  });

  describe('PUT /api/v1/users/me/preferences', () => {
    it('updates preferences', async () => {
      const response = await request(app)
        .put('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ theme: 'dark', isPhonePublic: true });

      expect(response.status).toBe(200);
      const prefs = JSON.parse(response.body.preferences);
      expect(prefs.theme).toBe('dark');
      expect(prefs.isPhonePublic).toBe(true);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('returns public profile', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('Magdalena');
    });

    it('returns 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/v1/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
    });
  });
});
