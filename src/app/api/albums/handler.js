/* c8 ignore next 2 */
import autoBind from 'auto-bind';
import app from '../../../config/app.js';

class AlbumHandler {
  constructor(service, storageService, albumUserLikeService, uploadsValidator) {
    this._service = service;
    this._uploadsValidator = uploadsValidator;
    this._storageService = storageService;
    this._albumUserLikeService = albumUserLikeService;
    autoBind(this);
  }

  async postAlbumHandler(req, h) {
    const albumId = await this._service.addAlbum(req.payload);
    return h.response({
      status: 'success',
      data: {
        albumId,
      },
    }).code(201);
  }

  async getAlbumsHandler(req, h) {
    const albums = await this._service.getAlbums();
    return h.response({
      status: 'success',
      data: {
        albums,
      },
    });
  }

  async getAlbumByIdHandler(req, h) {
    const { id } = req.params;
    const album = await this._service.getAlbumById(id);

    return h.response({
      status: 'success',
      data: {
        album,
      },
    });
  }

  async putAlbumHandler(req, h) {
    const { id } = req.params;
    await this._service.updateAlbumById(id, req.payload);
    return h.response({
      status: 'success',
      message: 'album updated',
    });
  }

  async deleteAlbumHandler(req, h) {
    const { id } = req.params;
    await this._service.deleteAlbumById(id);
    return h.response({
      status: 'success',
      message: 'album deleted',
    });
  }

  async postAlbumCoverHandler(req, h) {
    const { id } = req.params;
    const { cover } = req.payload;
    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${app.host}:${app.port}/albums/${id}/covers/images/${filename}`;
    await this._service.updateAlbumCoverById(id, coverUrl);
    return h.response({
      status: 'success',
      message: 'album cover uploaded',
    }).code(201);
  }

  async postAlbumUserLikeHandler(req, h) {
    const { id } = req.params;
    await this._service.verifyAlbumExists(id);
    const { userId } = req.auth.credentials;
    await this._albumUserLikeService.addAlbumUserLike(id, userId);
    return h.response({
      status: 'success',
      message: 'success like album',
    }).code(201);
  }

  async getAlbumUserLikeHandler(req, h) {
    const { id } = req.params;
    await this._service.verifyAlbumExists(id);
    const result = await this._albumUserLikeService.getAlbumUserLikeByAlbumId(id);
    const { likes, cache } = result;
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    if (cache) response.header('X-Data-Source', 'cache');

    return response;
  }

  async deleteAlbumUserLikeHandler(req, h) {
    const { id } = req.params;
    await this._service.verifyAlbumExists(id);
    const { userId } = req.auth.credentials;
    await this._albumUserLikeService.deleteAlbumUserLikeByAlbumId(id, userId);
    return h.response({
      status: 'success',
      message: 'success unlike album',
    });
  }
}

export default AlbumHandler;
