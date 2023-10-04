/* c8 ignore next 11 */
import PlaylistHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'playlists',
  version: '1.0.0',
  register: (server, {
    playlistsService, songsService, playlistSongsService, validator,
  }) => {
    const playlistHandler = new PlaylistHandler(
      playlistsService,
      songsService,
      playlistSongsService,
    );
    server.route(routes(playlistHandler, validator));
  },
};
