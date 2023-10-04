import autoBind from 'auto-bind';

class PlaylistHandler {
  constructor(playlistsService, songsService, playlistSongsService) {
    this._playlistsService = playlistsService;
    this._songService = songsService;
    this._playlistSongsService = playlistSongsService;
    autoBind(this);
  }

  async postPlaylistHandler(req, h) {
    const { name } = req.payload;
    const { userId } = req.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist({ name, userId });
    return h.response({
      status: 'success',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(req, h) {
    const { userId } = req.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(userId);
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
    await this._playlistsService.verifyPlaylistOwner(id, userId);
    await this._playlistsService.deletePlaylistById(id);
    return h.response({
      status: 'success',
      message: 'playlist deleted',
    });
  }

  async postSongInPlaylistHandler(req, h) {
    const { id } = req.params;
    const { userId } = req.auth.credentials;
    const { songId } = req.payload;
    await this._songService.verifySongExists(songId);
    await this._playlistsService.verifyPlaylistAccess(id, userId);
    await this._playlistSongsService.verifySongNotExistsInPlaylist(id, songId);
    await this._playlistSongsService.addSong(id, { songId });

    return h.response({
      status: 'success',
      message: 'success add song to playlist',
    }).code(201);
  }

  async getSongInPlaylistHandler(req, h) {
    const { id } = req.params;
    const { userId } = req.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(id, userId);
    const playlist = await this._playlistSongsService.getSongs(id, userId);

    return h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
  }

  async deleteSongInPlaylistHandler(req, h) {
    const { id } = req.params;
    const { userId } = req.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(id, userId);
    await this._playlistSongsService.deleteSong(id, req.payload);

    return h.response({
      status: 'success',
      message: 'success delete song to playlist',
    });
  }
}

export default PlaylistHandler;
