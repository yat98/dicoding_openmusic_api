/* c8 ignore next 27 */
import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import app from '../config/app.js';

import albumsPlugin from './api/albums/index.js';
import AlbumsService from './services/postgres/AlbumsService.js';
import albumsValidator from './validators/albums/index.js';

import songsPlugin from './api/songs/index.js';
import SongsService from './services/postgres/SongsService.js';
import songsValidator from './validators/songs/index.js';

import usersPlugin from './api/users/index.js';
import UsersService from './services/postgres/UserService.js';
import usersValidator from './validators/users/index.js';

import authenticationsPlugin from './api/authentications/index.js';
import AuthenticationsService from './services/postgres/AuthenticationsService.js';
import authenticationValidator from './validators/authentications/index.js';

import playlistsPlugin from './api/playlists/index.js';
import PlaylistsService from './services/postgres/PlaylistsService.js';
import PlaylistSongsService from './services/postgres/PlaylistSongsService.js';
import playlistValidator from './validators/playlists/index.js';

import collaborationsPlugin from './api/collaborations/index.js';
import CollaborationsService from './services/postgres/CollaborationsService.js';
import collaborationsValidator from './validators/collaborations/index.js';

import exportsPlugin from './api/exports/index.js';
import ProducersService from './services/rabbitmq/ProducersService.js';
import exportsValidator from './validators/exports/index.js';

import ClientError from './exceptions/ClientError.js';
import TokenManager from './tokenize/TokenManager.js';
import token from '../config/token.js';
import PlaylistActivitiesService from './services/postgres/PlaylistActivitiesService.js';

const albumsService = new AlbumsService();
const songsService = new SongsService();
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();
const collaborationsService = new CollaborationsService();
const playlistsService = new PlaylistsService(songsService, collaborationsService);
const playlistSongsService = new PlaylistSongsService();
const playlistActivitiesService = new PlaylistActivitiesService();

const server = Hapi.server({
  host: app.host,
  port: app.port,
  routes: {
    cors: {
      origin: [
        '*',
      ],
    },
  },
});

const registerPlugin = async () => {
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  /* c8 ignore next 15 */
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: token.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: token.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId,
      },
    }),
  });

  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: albumsService,
        validator: albumsValidator,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: songsValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: usersValidator,
      },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: authenticationValidator,
      },
    },
    {
      plugin: playlistsPlugin,
      options: {
        playlistsService,
        songsService,
        playlistSongsService,
        playlistActivitiesService,
        validator: playlistValidator,
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: collaborationsValidator,
      },
    },
    {
      plugin: exportsPlugin,
      options: {
        exportsService: ProducersService,
        playlistsService,
        validator: exportsValidator,
      },
    },
  ]);
};

/* c8 ignore next 40 */
server.ext('onPreResponse', (req, h) => {
  const { response } = req;

  if (response instanceof Error) {
    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    }

    if (!response.isServer) {
      return h.continue;
    }

    const res = {
      status: 'error',
      message: response.message,
    };
    if (app.mode === 'production') {
      res.message = 'server error';
    }
    console.log(res);
    return h.response(res).code(500);
  }
  return h.continue;
});

const init = async () => {
  await registerPlugin();
  await server.initialize();
  return server;
};

const start = async () => {
  await registerPlugin();
  await server.start();
  console.info(`Server listen on ${server.info.uri}`);
};

export default {
  init,
  start,
};
