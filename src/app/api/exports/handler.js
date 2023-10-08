import autoBind from 'auto-bind';

class ExportHandler {
  constructor(exportsService, playlistsService) {
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._queueKey = 'export:openmusic-playlists';
    autoBind(this);
  }

  async postExportPlaylistHandler(req, h) {
    const { userId } = req.auth.credentials;
    const { playlistId } = req.params;
    const { targetEmail } = req.payload;
    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    const message = JSON.stringify({ playlistId, targetEmail });
    await this._exportsService.sendMessage(this._queueKey, message);

    return h.response({
      status: 'success',
      message: 'your request on process',
    }).code(201);
  }
}

export default ExportHandler;
