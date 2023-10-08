/* c8 ignore next 11 */
import AlbumHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'albums',
  version: '1.0.0',
  register: (server, {
    service, storageService, uploadsValidator, validator,
  }) => {
    const albumHandler = new AlbumHandler(service, storageService, uploadsValidator);
    server.route(routes(albumHandler, validator));
  },
};
