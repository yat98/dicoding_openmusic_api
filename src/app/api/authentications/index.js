/* c8 ignore next 11 */
import AuthenticationHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'authentications',
  version: '1.0.0',
  register: (server, {
    authenticationsService, usersService, tokenManager, validator,
  }) => {
    const authenticationsHandler = new AuthenticationHandler(
      authenticationsService,
      usersService,
      tokenManager,
    );
    server.route(routes(authenticationsHandler, validator));
  },
};
