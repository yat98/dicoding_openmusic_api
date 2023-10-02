import autoBind from 'auto-bind';

class UsersHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  async postUserHandler(req, h) {
    const userId = await this._service.addUser(req.payload);
    return h.response({
      status: 'success',
      data: {
        userId,
      },
    }).code(201);
  }
}

export default UsersHandler;
