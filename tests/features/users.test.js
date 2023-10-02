import server from '../../src/app/server.js';
import { findUserId, payloadUser, removeAlluser } from '../utils/index.js';

let request;

beforeAll(async () => {
  request = await server.init();
});

afterAll(async () => {
  await removeAlluser();
  await request.stop();
});

describe('Test user feature: ', () => {
  describe('POST /users', () => {
    it('should success add user', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUser,
      });
      const { username, fullname } = await findUserId(response.result.data.userId);
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.userId).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(username).toBe(payloadUser.username);
      expect(fullname).toBe(payloadUser.fullname);
    });

    it('should success add user when username exists', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUser,
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('username already exists');
    });

    it('should reject add user', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: {},
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"fullname" is required. "username" is required. "password" is required');
    });
  });
});
