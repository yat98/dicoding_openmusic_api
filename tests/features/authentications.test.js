import server from '../../src/app/server.js';
import token from '../../src/config/token.js';
import {
  findUserId, firstUser, payloadAuthentication, payloadUser, removeAllUser,
} from '../utils/index.js';

let request;
let accessToken = '';
let refreshToken = '';

beforeAll(async () => {
  request = await server.init();
});

afterAll(async () => {
  await removeAllUser();
  await request.stop();
});

describe('Test autentication feature: ', () => {
  describe('POST /authentications', () => {
    it('should success authentication', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUser,
      });
      const { userId } = response.result.data;

      response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      const { token: resultToken } = await findUserId(userId);
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.data.accessToken).toBeDefined();
      expect(response.result.data.refreshToken).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('authentication success');
      expect(response.result.data.refreshToken).toBe(resultToken);

      accessToken = response.result.data.accessToken;
      refreshToken = response.result.data.refreshToken;
    });

    it('should reject authentication use failed user', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'notfoundusername',
          password: 'notfoundpassword',
        },
      });
      expect(response.statusCode).toBe(401);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('username or password is wrong');
    });

    it('should reject authentication', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: {},
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"username" is required. "password" is required');
    });
  });

  describe('PUT /authentications', () => {
    it('should success update token', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.data.accessToken).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('access token updated');
      expect(response.result.data.accessTokenToken).not.toBe(accessToken);

      accessToken = response.result.data.accessToken;
    });

    it('should reject update token if token not exists', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'invalidtoken',
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('token is invalid');
    });

    it('should reject update token if token empty', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {},
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"refreshToken" is required');
    });

    it('should reject update token if access token key invalid', async () => {
      const originalRefreshTokenKey = token.refreshTokenKey;
      token.refreshTokenKey = 'randomtokenkey';
      const response = await request.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('token is invalid');

      token.refreshTokenKey = originalRefreshTokenKey;
    });
  });

  describe('DELETE /authentications', () => {
    it('should success delete token', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });
      const { token: resultToken } = await firstUser();
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('refresh token deleted');
      expect(resultToken).toBeNull();
    });

    it('should reject delete token if token not exists', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 'invalidtoken',
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('token is invalid');
    });

    it('should reject delete token if token empty', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {},
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"refreshToken" is required');
    });

    it('should reject delete token if access token key invalid', async () => {
      const originalRefreshTokenKey = token.refreshTokenKey;
      token.refreshTokenKey = 'randomtokenkey';
      const response = await request.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('token is invalid');

      token.refreshTokenKey = originalRefreshTokenKey;
    });
  });
});
