import server from '../../src/app/server.js';
import {
  firstPlaylist, firstSong, payloadAuthentication,
  payloadAuthenticationFour,
  payloadAuthenticationThree, payloadAuthenticationTwo, payloadPlaylist,
  payloadSong, payloadUser, payloadUserFour, payloadUserThree, payloadUserTwo,
  removeAllCollaboration, removeAllPlaylist,
  removeAllPlaylistActivities,
  removeAllPlaylistSong, removeAllUser,
} from '../utils/index.js';

let request;
let accessToken = '';
let userThreeId = '';
let playlistId = '';
let songId = '';

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
      expect(response.result.data.playlists[0].id).toBeDefined();
      expect(response.result.data.playlists[0].name).toBeDefined();
      expect(response.result.data.playlists[0].username).toBeDefined();
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

    it('should success get list playlist use user collabolator has songs', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserFour,
      });
      const userFourId = response.result.data.userId;

      response = await request.inject({
        method: 'POST',
        url: '/playlists',
        payload: payloadPlaylist,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          userId: userFourId,
          playlistId: response.result.data.playlistId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationFour,
      });
      const localAccessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'GET',
        url: '/playlists',
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.playlists).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.playlists.length).toBe(1);
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

  describe('POST /playlists/{id}/songs', () => {
    it('should success add playlist use user owner', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/songs',
        payload: payloadSong,
      });
      songId = response.result.data.songId;

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
      });

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

      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success add song to playlist');
    });

    it('should reject add playlist if song id not exists', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      accessToken = response.result.data.accessToken;

      const playlist = await firstPlaylist();

      response = await request.inject({
        method: 'POST',
        url: `/playlists/${playlist.id}/songs`,
        payload: {
          songId: 'xxxx',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('song not found');
    });

    it('should reject add playlist if not owner', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationTwo,
      });

      const song = await firstSong();
      const playlist = await firstPlaylist();

      response = await request.inject({
        method: 'POST',
        url: `/playlists/${playlist.id}/songs`,
        payload: {
          songId: song.id,
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

    it('should reject playlist', async () => {
      const playlist = await firstPlaylist();
      const response = await request.inject({
        method: 'POST',
        url: `/playlists/${playlist.id}/songs`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"songId" is required');
    });

    it('should sucess add playlist use user collabolators', async () => {
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
      const localAccessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          userId: userThreeId,
          playlistId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      response = await request.inject({
        method: 'POST',
        url: '/songs',
        payload: payloadSong,
      });

      response = await request.inject({
        method: 'POST',
        url: `/playlists/${playlistId}/songs`,
        payload: {
          songId: response.result.data.songId,
        },
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success add song to playlist');
    });

    it('should reject add playlist if song exists', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });
      const localAccessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'POST',
        url: `/playlists/${playlistId}/songs`,
        payload: {
          songId,
        },
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('song already exists');
    });
  });

  describe('GET /playlist/{id}/songs', () => {
    it('should success get songs in playlist use user owner has songs', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      accessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'GET',
        url: `/playlists/${playlistId}/songs`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.playlist).toBeDefined();
      expect(response.result.data.playlist.id).toBeDefined();
      expect(response.result.data.playlist.name).toBeDefined();
      expect(response.result.data.playlist.username).toBeDefined();
      expect(response.result.data.playlist.songs).toBeDefined();
      expect(response.result.data.playlist.songs[0].id).toBeDefined();
      expect(response.result.data.playlist.songs[0].title).toBeDefined();
      expect(response.result.data.playlist.songs[0].performer).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.playlist.songs.length).toBe(2);
    });

    it('should success get songs in playlist use another user has no songs', async () => {
      let localAccessToken = '';
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationTwo,
      });
      localAccessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'POST',
        url: '/playlists',
        payload: payloadPlaylist,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      response = await request.inject({
        method: 'GET',
        url: `/playlists/${response.result.data.playlistId}/songs`,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.playlist).toBeDefined();
      expect(response.result.data.playlist.id).toBeDefined();
      expect(response.result.data.playlist.name).toBeDefined();
      expect(response.result.data.playlist.username).toBeDefined();
      expect(response.result.data.playlist.songs).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.playlist.songs.length).toBe(0);
    });

    it('should reject get songs in playlist use not user owner', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationTwo,
      });

      response = await request.inject({
        method: 'GET',
        url: `/playlists/${playlistId}/songs`,
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

    it('should reject get songs in playlist use invalid playlist id', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });

      response = await request.inject({
        method: 'GET',
        url: '/playlists/xxxx/songs',
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

    it('should success get songs in playlist use user collabolator has songs', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });
      const localAccessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'GET',
        url: `/playlists/${playlistId}/songs`,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.playlist).toBeDefined();
      expect(response.result.data.playlist.id).toBeDefined();
      expect(response.result.data.playlist.name).toBeDefined();
      expect(response.result.data.playlist.username).toBeDefined();
      expect(response.result.data.playlist.songs).toBeDefined();
      expect(response.result.data.playlist.songs[0].id).toBeDefined();
      expect(response.result.data.playlist.songs[0].title).toBeDefined();
      expect(response.result.data.playlist.songs[0].performer).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.playlist.songs.length).toBe(2);
    });
  });

  describe('DELETE /playlist/{id}/songs', () => {
    it('should success delete songs in playlist use user owner has songs', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      accessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'DELETE',
        url: `/playlists/${playlistId}/songs`,
        payload: {
          songId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success delete song to playlist');
    });

    it('should reject delete songs in playlist if not playlist owner', async () => {
      let response = await request.inject({
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
        url: '/authentications',
        payload: payloadAuthenticationTwo,
      });

      response = await request.inject({
        method: 'DELETE',
        url: `/playlists/${playlistId}/songs`,
        payload: {
          songId,
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

    it('should reject delete songs in playlist if song not exists', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: `/playlists/${playlistId}/songs`,
        payload: {
          songId: 'xxx',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('song not found');
    });

    it('should reject delete songs in playlist with invalid payload', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      accessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'DELETE',
        url: `/playlists/${playlistId}/songs`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"songId" is required');
    });

    it('should success delete songs in playlist use user collaboration has songs', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });
      const localAccessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'POST',
        url: '/songs',
        payload: payloadSong,
      });
      const { songId: id } = response.result.data;

      response = await request.inject({
        method: 'POST',
        url: `/playlists/${playlistId}/songs`,
        payload: {
          songId: id,
        },
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });

      response = await request.inject({
        method: 'DELETE',
        url: `/playlists/${playlistId}/songs`,
        payload: {
          songId: id,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success delete song to playlist');
    });
  });

  describe('GET /playlist/{id}/activities', () => {
    it('should success get list playlist activities', async () => {
      const response = await request.inject({
        method: 'GET',
        url: `/playlists/${playlistId}/activities`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.playlistId).toBeDefined();
      expect(response.result.data.activities).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(Array.isArray(response.result.data.activities)).toBe(true);
      expect(response.result.data.activities[0].username).toBeDefined();
      expect(response.result.data.activities[0].title).toBeDefined();
      expect(response.result.data.activities[0].action).toBeDefined();
      expect(response.result.data.activities[0].time).toBeDefined();
    });

    it('should success get playlist activities use another user has no songs', async () => {
      let localAccessToken = '';
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationTwo,
      });
      localAccessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'POST',
        url: '/playlists',
        payload: payloadPlaylist,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });

      response = await request.inject({
        method: 'GET',
        url: `/playlists/${response.result.data.playlistId}/activities`,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.playlistId).toBeDefined();
      expect(response.result.data.activities).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(Array.isArray(response.result.data.activities)).toBe(true);
      expect(response.result.data.activities.length).toBe(0);
    });

    it('should reject get playlist activities use not user owner', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationTwo,
      });

      response = await request.inject({
        method: 'GET',
        url: `/playlists/${playlistId}/activities`,
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

    it('should reject get list playlist activities use invalid playlist id', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/playlists/xxxx/activities',
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

    it('should success get playlist activities use user collabolator has songs', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthenticationThree,
      });
      const localAccessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'GET',
        url: `/playlists/${playlistId}/activities`,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.playlistId).toBeDefined();
      expect(response.result.data.activities).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(Array.isArray(response.result.data.activities)).toBe(true);
      expect(response.result.data.activities[0].username).toBeDefined();
      expect(response.result.data.activities[0].title).toBeDefined();
      expect(response.result.data.activities[0].action).toBeDefined();
      expect(response.result.data.activities[0].time).toBeDefined();
    });
  });
});
