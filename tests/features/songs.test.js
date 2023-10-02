import server from '../../src/app/server.js';
import {
  findSongId, firstSong, payloadSong, payloadUpdateSong, removeAllSong,
} from '../utils/index.js';

let request;

beforeAll(async () => {
  request = await server.init();
});

afterAll(async () => {
  await removeAllSong();
  await request.stop();
});

describe('Test song feature: ', () => {
  describe('POST /songs', () => {
    it('should success add song', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/songs',
        payload: payloadSong,
      });
      const {
        title, performer, year, genre, duration,
      } = await findSongId(response.result.data.songId);
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.songId).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(title).toBe(payloadSong.title);
      expect(performer).toBe(payloadSong.performer);
      expect(year).toBe(payloadSong.year);
      expect(genre).toBe(payloadSong.genre);
      expect(duration).toBe(payloadSong.duration);
    });

    it('should reject add song', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/songs',
        payload: {},
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"title" is required. "year" is required. "genre" is required. "performer" is required');
    });
  });

  describe('GET /songs', () => {
    it('should success get songs list', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/songs',
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.songs).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.songs[0].id).toBeDefined();
      expect(response.result.data.songs[0].title).toBeDefined();
      expect(response.result.data.songs[0].performer).toBeDefined();
    });

    it('should success get songs list by filter', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/songs?title=eva',
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.songs).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.songs.length).toBe(1);
    });

    it('should success get songs list by filter with 2 filter', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/songs?title=eva&performer=andi',
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.songs).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.songs.length).toBe(0);
    });

    it('should success get songs list by filter with invalid value', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/songs?title=invalidtitle&performer=invalidperformer',
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.songs).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.songs).toEqual([]);
    });
  });

  describe('GET /songs/{id}', () => {
    it('should success get detail song', async () => {
      const song = await firstSong();
      const response = await request.inject({
        method: 'GET',
        url: `/songs/${song.id}`,
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.song).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.song.id).toBeDefined();
      expect(response.result.data.song.title).toBeDefined();
      expect(response.result.data.song.performer).toBeDefined();
    });

    it('should return 404 when get detail song', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/songs/invalidid',
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('song not found');
    });
  });

  describe('PUT /songs/{id}', () => {
    it('should success update song', async () => {
      const song = await firstSong();
      const response = await request.inject({
        method: 'PUT',
        url: `/songs/${song.id}`,
        payload: payloadUpdateSong,
      });
      const {
        title, performer, year, genre, duration,
      } = await findSongId(song.id);
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('song updated');
      expect(title).toBe(payloadUpdateSong.title);
      expect(performer).toBe(payloadUpdateSong.performer);
      expect(year).toEqual(payloadUpdateSong.year);
      expect(genre).toEqual(payloadUpdateSong.genre);
      expect(duration).toEqual(payloadUpdateSong.duration);
    });

    it('should reject update song', async () => {
      const song = await firstSong();
      const response = await request.inject({
        method: 'PUT',
        url: `/songs/${song.id}`,
        payload: {},
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"title" is required. "year" is required. "genre" is required. "performer" is required');
    });

    it('should return 404 when update song', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: '/songs/invalidid',
        payload: payloadSong,
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('song not found');
    });
  });

  describe('DELETE /songs/{id}', () => {
    it('should success delete song', async () => {
      const song = await firstSong();
      const response = await request.inject({
        method: 'DELETE',
        url: `/songs/${song.id}`,
      });
      const result = await findSongId(song.id);
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('song deleted');
      expect(result).toBeUndefined();
    });

    it('should return 404 when delete song', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/songs/invalidid',
        payload: payloadSong,
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('song not found');
    });
  });
});
