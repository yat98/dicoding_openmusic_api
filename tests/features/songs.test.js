import pg from 'pg';
import server from '../../src/app/server.js';
import {
  getByIdQuery, getQuery, mapDBSongToModel, mapDBSongsToModel,
} from '../../src/utils';

let request;
const { Pool } = pg;
const pool = new Pool();
const payload = {
  title: 'Evaluasi',
  year: 2023,
  genre: 'Indie',
  performer: 'Hindia',
  duration: 240,
};
const payloadUpdate = {
  title: 'Lorem Ipsum',
  year: 2023,
  genre: 'Rock',
  performer: 'Sit Dolor',
  duration: 380,
};

const firstSong = async () => {
  const query = getQuery('songs');
  const result = await pool.query(query);
  return result.rows.map(mapDBSongsToModel)[0];
};

const findSongId = async (id) => {
  const query = getByIdQuery(id, 'songs');
  const result = await pool.query(query);
  return result.rows.map(mapDBSongToModel)[0];
};

const removeAllSong = async () => {
  const query = {
    text: 'DELETE FROM songs',
  };
  await pool.query(query);
};

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
        payload,
      });
      const {
        title, performer, year, genre, duration,
      } = await findSongId(response.result.data.songId);
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.songId).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(title).toBe(payload.title);
      expect(performer).toBe(payload.performer);
      expect(year).toBe(payload.year);
      expect(genre).toBe(payload.genre);
      expect(duration).toBe(payload.duration);
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
        payload: payloadUpdate,
      });
      const {
        title, performer, year, genre, duration,
      } = await findSongId(song.id);
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('song updated');
      expect(title).toBe(payloadUpdate.title);
      expect(performer).toBe(payloadUpdate.performer);
      expect(year).toEqual(payloadUpdate.year);
      expect(genre).toEqual(payloadUpdate.genre);
      expect(duration).toEqual(payloadUpdate.duration);
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
        payload,
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
        payload,
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('song not found');
    });
  });
});
