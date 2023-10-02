import server from '../../src/app/server.js';
import {
  findAlbumId, firstAlbum, payloadAlbum,
  payloadAlbumUpdate, payloadSong, removeAllAlbum, removeAllSong,
} from '../utils/index.js';

let request;

beforeAll(async () => {
  request = await server.init();
});

afterAll(async () => {
  await removeAllSong();
  await removeAllAlbum();
  await request.stop();
});

describe('Test album feature: ', () => {
  describe('POST /albums', () => {
    it('should success add album', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/albums',
        payload: payloadAlbum,
      });
      const { name, year } = await findAlbumId(response.result.data.albumId);
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.data.albumId).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(name).toBe(payloadAlbum.name);
      expect(year).toEqual(payloadAlbum.year);
    });

    it('should reject add album', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/albums',
        payload: {},
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"name" is required. "year" is required');
    });
  });

  describe('GET /albums', () => {
    it('should success get albums list', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/albums',
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.albums).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.albums[0].id).toBeDefined();
      expect(response.result.data.albums[0].name).toBeDefined();
      expect(response.result.data.albums[0].year).toBeDefined();
    });
  });

  describe('GET /albums/{id}', () => {
    it('should success get detail album', async () => {
      const album = await firstAlbum();
      const response = await request.inject({
        method: 'GET',
        url: `/albums/${album.id}`,
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.album).toBeDefined();
      expect(response.result.data.album.songs).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.album.id).toBeDefined();
      expect(response.result.data.album.name).toBeDefined();
      expect(response.result.data.album.year).toBeDefined();
    });

    it('should success get detail album which contain songs', async () => {
      await removeAllSong();
      const album = await firstAlbum();
      let response = await request.inject({
        method: 'POST',
        url: '/songs',
        payload: {
          ...payloadSong,
          albumId: album.id,
        },
      });

      response = await request.inject({
        method: 'GET',
        url: `/albums/${album.id}`,
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.album).toBeDefined();
      expect(response.result.data.album.songs).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.album.id).toBeDefined();
      expect(response.result.data.album.name).toBeDefined();
      expect(response.result.data.album.year).toBeDefined();
      expect(response.result.data.album.songs.length).toBe(1);
    });

    it('should return 404 when get detail album', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/albums/invalidid',
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('album not found');
    });
  });

  describe('PUT /albums/{id}', () => {
    it('should success update album', async () => {
      const album = await firstAlbum();
      const response = await request.inject({
        method: 'PUT',
        url: `/albums/${album.id}`,
        payload: payloadAlbumUpdate,
      });
      const { name, year } = await findAlbumId(album.id);
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('album updated');
      expect(name).toBe(payloadAlbumUpdate.name);
      expect(year).toEqual(payloadAlbumUpdate.year);
    });

    it('should reject update album', async () => {
      const album = await firstAlbum();
      const response = await request.inject({
        method: 'PUT',
        url: `/albums/${album.id}`,
        payload: {},
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"name" is required. "year" is required');
    });

    it('should return 404 when update album', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: '/albums/invalidid',
        payload: payloadAlbum,
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('album not found');
    });
  });

  describe('DELETE /albums/{id}', () => {
    it('should success delete album', async () => {
      const album = await firstAlbum();
      const response = await request.inject({
        method: 'DELETE',
        url: `/albums/${album.id}`,
      });
      const result = await findAlbumId(album.id);
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('album deleted');
      expect(result).toBeUndefined();
    });

    it('should return 404 when delete album', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/albums/invalidid',
        payload: payloadAlbum,
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('album not found');
    });
  });
});
