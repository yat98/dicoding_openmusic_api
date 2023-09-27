import autoBind from 'auto-bind';

class SongHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  async postSongHandler(req, h) {
    const songId = await this._service.addSong(req.payload);
    return h.response({
      status: 'success',
      data: {
        songId,
      },
    }).code(201);
  }

  async getSongsHandler(req, h) {
    const { title, performer } = req.query;
    const songs = await this._service.getSongs({ title, performer });
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    });
  }

  async getSongByIdHandler(req, h) {
    const { id } = req.params;
    const song = await this._service.getSongById(id);

    return h.response({
      status: 'success',
      data: {
        song,
      },
    });
  }

  async putSongHandler(req, h) {
    const { id } = req.params;
    await this._service.updateSongById(id, req.payload);

    return h.response({
      status: 'success',
      message: 'song updated',
    });
  }

  async deleteSongHandler(req, h) {
    const { id } = req.params;
    await this._service.deleteSongById(id);
    return h.response({
      status: 'success',
      message: 'song deleted',
    });
  }
}

export default SongHandler;
