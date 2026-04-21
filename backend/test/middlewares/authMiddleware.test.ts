import { Request, Response, NextFunction } from 'express';
import { requireAuthentication, requireAdminRole, AuthenticatedRequest } from '../../src/middlewares/authMiddleware';
import * as jwtUtils from '../../src/utils/jwtUtils';

jest.mock('../../src/utils/jwtUtils');

describe('Auth Middleware Validation', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('rejects requests without authorization header', () => {
    requireAuthentication(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized credentials' });
  });

  it('rejects requests with malformed tokens', () => {
    mockRequest.headers = { authorization: 'Bearer ' };
    requireAuthentication(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });

  it('accepts valid credentials', () => {
    mockRequest.headers = { authorization: 'Bearer VALID_TOKEN' };
    (jwtUtils.verifyToken as jest.Mock).mockReturnValue({ userId: '123', role: 'RESIDENT' });

    requireAuthentication(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect((mockRequest as AuthenticatedRequest).user?.userId).toBe('123');
  });

  it('admin role guard rejects residents', () => {
    mockRequest.user = { userId: '123', role: 'RESIDENT', isVerified: true, blockId: 'block1', iat: 1, exp: 2 };
    requireAdminRole(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  it('admin role guard accepts admins', () => {
    mockRequest.user = { userId: '123', role: 'ADMIN', isVerified: true, blockId: 'block1', iat: 1, exp: 2 };
    requireAdminRole(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
