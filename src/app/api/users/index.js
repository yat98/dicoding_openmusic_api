/* c8 ignore next 11 */
import UsersHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'users',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const usersHandler = new UsersHandler(service);
    server.route(routes(usersHandler, validator));
  },
};
