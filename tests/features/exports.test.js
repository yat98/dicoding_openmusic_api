import server from '../../src/app/server.js';
import {
  payloadAuthentication,
  payloadAuthenticationThree,
  payloadAuthenticationTwo,
  payloadPlaylist,
  payloadSong,
  payloadUser,
  payloadUserThree,
  payloadUserTwo,
  removeAllCollaboration, removeAllPlaylist, removeAllPlaylistActivities,
  removeAllPlaylistSong, removeAllUser,
} from '../utils/index.js';

let request;
let accessToken = '';
let playlistId = '';

beforeAll(async () => {
  request = await server.init();
  await removeAllPlaylistActivities();
  await removeAllPlaylistSong();
  await removeAllPlaylist();
  await removeAllCollaboration();
  await removeAllUser();
});

afterAll(async () => {
  await removeAllPlaylistActivities();
  await removeAllPlaylistSong();
  await removeAllPlaylist();
  await removeAllCollaboration();
  await removeAllUser();
  await request.stop();
});

describe('Test export playlist feature: ', () => {
  describe('POST /export/playlists/{playlistId}', () => {
    it('should success export playlists use owner user', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUser,
      });

      response = await request.inject({
        method: 'POST',
        url: '/songs',
        payload: payloadSong,
      });
      const { songId } = response.result.data;

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
      playlistId = response.result.data.playlistId;

      response = await request.inject({
        method: 'POST',
        url: `/playlists/${playlistId}/songs`,
        payload: {
          songId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      response = await request.inject({
        method: 'POST',
        url: `/export/playlists/${playlistId}`,
        payload: {
          targetEmail: 'hidayatchandra08@gmail.com',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('your request on process');
    });

    it('should reject export playlists use not owner user', async () => {
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
      const { accessToken: localAccessToken } = response.result.data;

      response = await request.inject({
        method: 'POST',
        url: `/export/playlists/${playlistId}`,
        payload: {
          targetEmail: 'hidayatchandra08@gmail.com',
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

    it('should reject export playlists use collabolator user', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserThree,
      });
      const { userId } = response.result.data;

      response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });
      const { accessToken: localAccessToken } = response.result.data;

      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          userId,
          playlistId,
        },
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });

      response = await request.inject({
        method: 'POST',
        url: `/export/playlists/${playlistId}`,
        payload: {
          targetEmail: 'hidayatchandra08@gmail.com',
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

    it('should reject export playlists invalid payload', async () => {
      const response = await request.inject({
        method: 'POST',
        url: `/export/playlists/${playlistId}`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"targetEmail" is required');
    });

    it('should reject export playlists invalid playlist', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/export/playlists/xxxxxx',
        payload: {
          targetEmail: 'hidayatchandra08@gmail.com',
        },
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
  });
});
