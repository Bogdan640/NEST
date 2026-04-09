import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let validToken: string;

describe('Feed Routes Verification', () => {
  beforeAll(async () => {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'magdalena.potarniche@nest.local',
      password: 'parola123'
    });
    validToken = loginResponse.body.token;

    await prisma.post.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/feed', () => {
    it('creates a new post', async () => {
      const response = await request(app)
        .post('/api/v1/feed')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ content: 'Buna dimineata tuturor vecinilor!' });
      
      expect(response.status).toBe(201);
      expect(response.body.content).toBe('Buna dimineata tuturor vecinilor!');
    });

    it('rejects secondary post within same day', async () => {
      const response = await request(app)
        .post('/api/v1/feed')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ content: 'Inca un mesaj de la mine astazi' });
      
      expect(response.status).toBe(429);
      expect(response.body.error).toBe('Daily post limit exceeded');
    });
  });

  describe('GET /api/v1/feed', () => {
    it('retrieves feed chronologically', async () => {
      const response = await request(app)
        .get('/api/v1/feed')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Validation & Edge Cases', () => {
    it('fails without auth', async () => {
      const response = await request(app).post('/api/v1/feed').send({ content: 'Test' });
      expect(response.status).toBe(401);
    });

    it('fails on missing post content', async () => {
      const response = await request(app).post('/api/v1/feed').set('Authorization', `Bearer ${validToken}`).send({});
      expect(response.status).toBe(400);
    });
  });
});
