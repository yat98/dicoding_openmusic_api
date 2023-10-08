/* c8 ignore next 2 */
import autoBind from 'auto-bind';
import app from '../../../config/app.js';

class AlbumHandler {
  constructor(service, storageService, uploadsValidator) {
    this._service = service;
    this._uploadsValidator = uploadsValidator;
    this._storageService = storageService;
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
    const coverUrl = `http://${app.host}:${app.port}/albums/upload/images/${filename}`;
    await this._service.updateAlbumCoverById(id, coverUrl);
    return h.response({
      status: 'success',
      message: 'album cover uploaded',
    }).code(201);
  }
}

export default AlbumHandler;
