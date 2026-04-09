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
});
