import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let validToken: string;
let executionEventId: string;

describe('Events Routes Verification', () => {
  beforeAll(async () => {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'magdalena.potarniche@nest.local',
      password: 'parola123'
    });
    validToken = loginResponse.body.token;

    await prisma.eventAttendee.deleteMany();
    await prisma.event.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/events', () => {
    it('creates an event successfully', async () => {
      const response = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Asociatia de Locatari Meeting',
          description: 'Sedinta de bloc trimestriala',
          location: 'Scara A - parter',
          type: 'MEETING',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          maxParticipants: 5
        });
      
      expect(response.status).toBe(201);
      executionEventId = response.body.id;
    });
  });

  describe('POST /api/v1/events/:id/join', () => {
    it('joins an event successfully', async () => {
      const response = await request(app)
        .post(`/api/v1/events/${executionEventId}/join`)
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(response.status).toBe(200);
    });

    it('rejects duplicated join constraint', async () => {
      const response = await request(app)
        .post(`/api/v1/events/${executionEventId}/join`)
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Already joined this event');
    });

    it('rejects completely maximized capacity', async () => {
      const smallEventReq = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Small meeting',
          description: 'Sedinta mica',
          location: 'Scara A',
          type: 'MEETING',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 360000).toISOString(),
          maxParticipants: 1
        });
      const smallEventId = smallEventReq.body.id;

      await request(app)
        .post(`/api/v1/events/${smallEventId}/join`)
        .set('Authorization', `Bearer ${validToken}`);

      const altLogin = await request(app).post('/api/v1/auth/login').send({
        email: 'valeria.trotineta@nest.local',
        password: 'parola123'
      });
      const altToken = altLogin.body.token;

      const response = await request(app)
        .post(`/api/v1/events/${smallEventId}/join`)
        .set('Authorization', `Bearer ${altToken}`);
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Event capacity completely maximized');
    });
  });

  describe('Validation & Edge Cases', () => {
    it('fails without auth', async () => {
      const response = await request(app).post('/api/v1/events').send({ title: 'Test' });
      expect(response.status).toBe(401);
    });

    it('fails on missing event payload', async () => {
      const response = await request(app).post('/api/v1/events').set('Authorization', `Bearer ${validToken}`).send({});
      expect(response.status).toBe(400);
    });

    it('retrieves events with pagination', async () => {
      const response = await request(app).get('/api/v1/events').set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeDefined();
    });
  });

  describe('GET /api/v1/events/:id', () => {
    it('retrieves event by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/events/${executionEventId}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(executionEventId);
      expect(response.body.title).toBeDefined();
    });

    it('returns 404 for non-existent event', async () => {
      const response = await request(app)
        .get('/api/v1/events/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/events/:id/leave', () => {
    it('leaves a joined event', async () => {
      const response = await request(app)
        .post(`/api/v1/events/${executionEventId}/leave`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
    });

    it('returns 404 when not attending', async () => {
      const response = await request(app)
        .post(`/api/v1/events/${executionEventId}/leave`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/events/:id', () => {
    it('updates own event', async () => {
      const response = await request(app)
        .put(`/api/v1/events/${executionEventId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'Updated Title', description: 'Updated Description' });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
    });

    it('rejects update with missing fields', async () => {
      const response = await request(app)
        .put(`/api/v1/events/${executionEventId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/events/:id', () => {
    it('deletes own event', async () => {
      const response = await request(app)
        .delete(`/api/v1/events/${executionEventId}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(204);
    });

    it('returns 404 for already deleted event', async () => {
      const response = await request(app)
        .delete(`/api/v1/events/${executionEventId}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(404);
    });
  });
});

