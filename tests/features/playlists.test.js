import server from '../../src/app/server.js';
import {
  firstPlaylist, payloadAuthentication, payloadAuthenticationTwo, payloadPlaylist,
  payloadUser, payloadUserTwo, removeAllPlaylist,
  removeAllUser,
} from '../utils/index.js';

let request;
let accessToken = '';

beforeAll(async () => {
  request = await server.init();
});

afterAll(async () => {
  await removeAllPlaylist();
  await removeAllUser();
  await request.stop();
});

describe('Test playlist feature: ', () => {
  describe('POST /playlists', () => {
    it('should success add playlist', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUser,
      });

      response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      accessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'POST',
        url: '/playlists',
        payload: payloadPlaylist,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id } = await firstPlaylist();
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.playlistId).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.playlistId).toBe(id);
    });

    it('should reject add playlist', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/playlists',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"name" is required');
    });
  });

  describe('GET /playlists', () => {
    it('should success get list playlist', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/playlists',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.playlists).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.playlists.length).toBe(1);
    });

    it('should success get list playlist use another user', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserTwo,
      });

      response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationTwo,
      });

      response = await request.inject({
        method: 'GET',
        url: '/playlists',
        headers: {
          Authorization: `Bearer ${response.result.data.accessToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.playlists).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.playlists.length).toBe(0);
    });
  });

  describe('DELETE /playlists', () => {
    it('should success delete playlist', async () => {
      const { id } = await firstPlaylist();
      const response = await request.inject({
        method: 'DELETE',
        url: `/playlists/${id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('playlist deleted');
    });

    it('should reject delete playlist use invalid id', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/playlists/xxxx',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('playlist not found');
    });

    it('should reject delete playlist use another user', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/playlists',
        payload: payloadPlaylist,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { id } = await firstPlaylist();

      response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationTwo,
      });

      response = await request.inject({
        method: 'DELETE',
        url: `/playlists/${id}`,
        headers: {
          Authorization: `Bearer ${response.result.data.accessToken}`,
        },
      });

      expect(response.statusCode).toBe(403);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('unauthorized');
    });
  });
});
