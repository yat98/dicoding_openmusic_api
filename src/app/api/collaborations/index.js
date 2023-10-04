/* c8 ignore next 11 */
import CollaborationsHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'collaborations',
  version: '1.0.0',
  register: (server, {
    collaborationsService, playlistsService, usersService, validator,
  }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      usersService,
    );
    server.route(routes(collaborationsHandler, validator));
  },
};
