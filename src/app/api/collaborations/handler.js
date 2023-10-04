import autoBind from 'auto-bind';

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    autoBind(this);
  }

  async postCollaborationHandler(req, h) {
    const { playlistId, userId } = req.payload;
    await this._usersService.verifyUserExists(userId);
    const { userId: credentialId } = req.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    return h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationHandler(req, h) {
    const { playlistId, userId } = req.payload;
    await this._usersService.verifyUserExists(userId);
    const { userId: credentialId } = req.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return h.response({
      status: 'success',
      message: 'collaboration deleted',
    });
  }
}

export default CollaborationsHandler;
