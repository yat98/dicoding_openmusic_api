import { URL } from 'url';
import supertest from 'supertest';
import server from '../../src/app/server.js';
import {
  findAlbumId, firstAlbum, payloadAlbum,
  payloadAlbumUpdate, payloadAuthentication, payloadAuthenticationTwo,
  payloadSong, payloadUser, payloadUserTwo, removeAllAlbum,
  removeAllAlbumUserLikes, removeAllSong, removeAllUser,
} from '../utils/index.js';
import app from '../../src/config/app.js';

let request;

beforeAll(async () => {
  await removeAllSong();
  await removeAllAlbum();
  await removeAllAlbumUserLikes();
  await removeAllUser();
  request = await server.init();
});

afterAll(async () => {
  await removeAllSong();
  await removeAllAlbum();
  await removeAllAlbumUserLikes();
  await removeAllUser();
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

  describe('POST /albums/{id}/covers', () => {
    it('should success upload album cover', async () => {
      const __dirname = new URL('.', import.meta.url).pathname;
      let response = await request.inject({
        method: 'POST',
        url: '/albums',
        payload: payloadAlbum,
      });
      let album = await firstAlbum();

      response = await supertest(request.listener)
        .post(`/albums/${album.id}/covers`)
        .attach('cover', `${__dirname}/uploads/flower.jpg`);
      expect(response.status).toBe(201);
      expect(response.body.status).toBeDefined();
      expect(response.body.message).toBeDefined();
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('album cover uploaded');

      album = await firstAlbum();
      response = await supertest(request.listener)
        .get(album.coverUrl.replace(`http://${app.host}:${app.port}`, ''));
      expect(response.status).toBe(200);
    });

    it('should reject upload album cover use big image', async () => {
      const album = await firstAlbum();

      const response = await supertest(request.listener)
        .post(`/albums/${album.id}/covers`)
        .attach('cover', `${__dirname}/uploads/picture-large.jpg`);
      expect(response.status).toBe(413);
    });

    it('should reject upload album cover invalid payload', async () => {
      const album = await firstAlbum();

      const response = await supertest(request.listener)
        .post(`/albums/${album.id}/covers`)
        .attach('cover', `${__dirname}/uploads/text-small.txt`);
      expect(response.status).toBe(400);
      expect(response.body.status).toBeDefined();
      expect(response.body.message).toBeDefined();
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('"content-type" must be one of [image/apng, image/avif, image/gif, image/jpeg, image/png, image/svg+xml, image/webp]');
    });
  });

  describe('POST /albums/{id}/likes', () => {
    it('should success like album', async () => {
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
      const localAccessToken = response.result.data.accessToken;
      const album = await firstAlbum();

      response = await request.inject({
        method: 'POST',
        url: `/albums/${album.id}/likes`,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success like album');
    });

    it('should reject like album twice', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      const localAccessToken = response.result.data.accessToken;
      const album = await firstAlbum();

      response = await request.inject({
        method: 'POST',
        url: `/albums/${album.id}/likes`,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('album already liked');
    });

    it('should reject like album if invalid album', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      const localAccessToken = response.result.data.accessToken;

      response = await request.inject({
        method: 'POST',
        url: '/albums/xxxx/likes',
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('album not found');
    });

    it('should success like album use another user', async () => {
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
      const localAccessToken = response.result.data.accessToken;
      const album = await firstAlbum();

      response = await request.inject({
        method: 'POST',
        url: `/albums/${album.id}/likes`,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success like album');
    });
  });

  describe('GET /albums/{id}/likes', () => {
    it('should success get count like album use authentication', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      const localAccessToken = response.result.data.accessToken;
      const album = await firstAlbum();

      response = await request.inject({
        method: 'GET',
        url: `/albums/${album.id}/likes`,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.likes).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.likes).toBe(2);
    });

    it('should success get count like album without authentication', async () => {
      const album = await firstAlbum();

      const response = await request.inject({
        method: 'GET',
        url: `/albums/${album.id}/likes`,
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.likes).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.likes).toBe(2);
    });
  });

  describe('DELETE /albums/{id}/likes', () => {
    it('should success unlike album', async () => {
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: payloadAuthentication,
      });
      const localAccessToken = response.result.data.accessToken;
      const album = await firstAlbum();

      response = await request.inject({
        method: 'DELETE',
        url: `/albums/${album.id}/likes`,
        headers: {
          Authorization: `Bearer ${localAccessToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success unlike album');
    });
  });
});
