/* c8 ignore next 11 */
import SongHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'songs',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const songHandler = new SongHandler(service);
    server.route(routes(songHandler, validator));
  },
};
