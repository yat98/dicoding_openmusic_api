import autoBind from 'auto-bind';

class AlbumHandler {
  constructor(service) {
    this._service = service;
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
}

export default AlbumHandler;
