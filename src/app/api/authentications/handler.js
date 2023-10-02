import autoBind from 'auto-bind';

class AuthenticationHandler {
  constructor(authenticationsService, usersService, tokenManager) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    autoBind(this);
  }

  async postAuthenticationHandler(req, h) {
    const { username, password } = req.payload;
    const userId = await this._usersService.verifyUserCredential(username, password);
    const accessToken = await this._tokenManager.generateAccessToken({ userId });
    const refreshToken = await this._tokenManager.generateRefreshToken({ userId });
    await this._authenticationsService.addRefreshToken(userId, refreshToken);

    return h.response({
      status: 'success',
      message: 'authentication success',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async putAuthenticationHandler(req, h) {
    const { refreshToken } = req.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { userId } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken(userId);

    return h.response({
      status: 'success',
      message: 'access token updated',
      data: {
        accessToken,
      },
    });
  }

  async deleteAuthenticationHandler(req, h) {
    const { refreshToken } = req.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'refresh token deleted',
    });
  }
}

export default AuthenticationHandler;
