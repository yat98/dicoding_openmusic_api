import server from '../../src/app/server.js';
import {
  firstPlaylist,
  payloadAuthentication,
  payloadAuthenticationThree,
  payloadAuthenticationTwo,
  payloadPlaylist,
  payloadUser,
  payloadUserThree,
  payloadUserTwo,
  removeAllCollaboration, removeAllPlaylist,
  removeAllPlaylistSong,
  removeAllUser,
} from '../utils/index.js';

let request;
let accessToken = '';
let userTwoId = '';
let userThreeId = '';

beforeAll(async () => {
  request = await server.init();
  await removeAllPlaylistSong();
  await removeAllPlaylist();
  await removeAllCollaboration();
  await removeAllUser();
});

afterAll(async () => {
  await removeAllPlaylistSong();
  await removeAllPlaylist();
  await removeAllCollaboration();
  await removeAllUser();
  await request.stop();
});

describe('Test playlist feature: ', () => {
  describe('POST /collaborations', () => {
    it('should success add collaboration', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUser,
      });

      response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserTwo,
      });
      userTwoId = response.result.data.userId;

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

      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          userId: userTwoId,
          playlistId: id,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.collaborationId).toBeDefined();
      expect(response.result.status).toBe('success');
    });

    it('should reject add collaboration if not owner', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserThree,
      });
      userThreeId = response.result.data.userId;

      response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });
      const { id } = await firstPlaylist();

      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          userId: userThreeId,
          playlistId: id,
        },
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

    it('should reject add collaboration if user not exists', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });
      const { id } = await firstPlaylist();

      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          userId: 'xxxx',
          playlistId: id,
        },
        headers: {
          Authorization: `Bearer ${response.result.data.accessToken}`,
        },
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('user not found');
    });

    it('should reject add collaboration if playlist not exists', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });

      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          userId: userThreeId,
          playlistId: 'xxxx',
        },
        headers: {
          Authorization: `Bearer ${response.result.data.accessToken}`,
        },
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('playlist not found');
    });

    it('should reject add collaboration', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"playlistId" is required. "userId" is required');
    });
  });

  describe('DELETE /collaborations', () => {
    it('should success delete collaboration', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      accessToken = response.result.data.accessToken;
      const { id } = await firstPlaylist();

      response = await request.inject({
        method: 'DELETE',
        url: '/collaborations',
        payload: {
          userId: userTwoId,
          playlistId: id,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('collaboration deleted');
    });

    it('should reject delete collaboration if not owner', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationTwo,
      });
      const localAccessToken = response.result.data.accessToken;
      const { id } = await firstPlaylist();

      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          userId: userTwoId,
          playlistId: id,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      response = await request.inject({
        method: 'DELETE',
        url: '/collaborations',
        payload: {
          userId: userTwoId,
          playlistId: id,
        },
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(403);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('unauthorized');
    });

    it('should reject delete collaboration if user not exists', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });
      const { id } = await firstPlaylist();

      response = await request.inject({
        method: 'DELETE',
        url: '/collaborations',
        payload: {
          userId: 'xxxx',
          playlistId: id,
        },
        headers: {
          Authorization: `Bearer ${response.result.data.accessToken}`,
        },
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('user not found');
    });

    it('should reject delete collaboration if playlist not exists', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });

      response = await request.inject({
        method: 'DELETE',
        url: '/collaborations',
        payload: {
          userId: userThreeId,
          playlistId: 'xxxx',
        },
        headers: {
          Authorization: `Bearer ${response.result.data.accessToken}`,
        },
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('playlist not found');
    });

    it('should reject delete collaboration', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/collaborations',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"playlistId" is required. "userId" is required');
    });
  });
});
