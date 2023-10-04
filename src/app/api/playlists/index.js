/* c8 ignore next 11 */
import PlaylistHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'playlists',
  version: '1.0.0',
  register: (server, {
    playlistsService, songsService, playlistSongsService, playlistActivitiesService, validator,
  }) => {
    const playlistHandler = new PlaylistHandler(
      playlistsService,
      songsService,
      playlistSongsService,
      playlistActivitiesService,
    );
    server.route(routes(playlistHandler, validator));
  },
};
