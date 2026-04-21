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
    it('retrieves feed with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/feed')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.total).toBeDefined();
      expect(response.body.page).toBe(1);
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

  describe('GET /api/v1/feed/:id', () => {
    it('retrieves post by ID', async () => {
      const allPosts = await request(app).get('/api/v1/feed').set('Authorization', `Bearer ${validToken}`);
      const postId = allPosts.body.data[0].id;

      const response = await request(app)
        .get(`/api/v1/feed/${postId}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(postId);
    });

    it('returns 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/api/v1/feed/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/feed/:id', () => {
    it('updates own post', async () => {
      const allPosts = await request(app).get('/api/v1/feed').set('Authorization', `Bearer ${validToken}`);
      const postId = allPosts.body.data[0].id;

      const response = await request(app)
        .put(`/api/v1/feed/${postId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ content: 'Updated content here' });
      expect(response.status).toBe(200);
      expect(response.body.content).toBe('Updated content here');
    });

    it('rejects update with missing content', async () => {
      const allPosts = await request(app).get('/api/v1/feed').set('Authorization', `Bearer ${validToken}`);
      const postId = allPosts.body.data[0].id;

      const response = await request(app)
        .put(`/api/v1/feed/${postId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/feed/:id', () => {
    it('deletes own post', async () => {
      const allPosts = await request(app).get('/api/v1/feed').set('Authorization', `Bearer ${validToken}`);
      const postId = allPosts.body.data[0].id;

      const response = await request(app)
        .delete(`/api/v1/feed/${postId}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(204);
    });

    it('returns 404 for already deleted post', async () => {
      const response = await request(app)
        .delete('/api/v1/feed/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(404);
    });
  });
});

