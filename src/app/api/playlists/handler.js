import autoBind from 'auto-bind';

class PlaylistHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  async postPlaylistHandler(req, h) {
    const { name } = req.payload;
    const { userId } = req.auth.credentials;
    const playlistId = await this._service.addPlaylist({ name, userId });
    return h.response({
      status: 'success',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(req, h) {
    const { userId } = req.auth.credentials;
    const playlists = await this._service.getPlaylists(userId);
    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
  }

  async deletePlaylistHandler(req, h) {
    const { id } = req.params;
    const { userId } = req.auth.credentials;
    await this._service.verifyPlaylistOwner(id, userId);
    await this._service.deletePlaylistById(id);
    return h.response({
      status: 'success',
      message: 'playlist deleted',
    });
  }
}

export default PlaylistHandler;
