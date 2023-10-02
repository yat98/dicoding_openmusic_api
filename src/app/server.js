/* c8 ignore next 21 */
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

import ClientError from './exceptions/ClientError.js';
import TokenManager from './tokenize/TokenManager.js';
import token from '../config/token.js';

const albumsService = new AlbumsService();
const songsService = new SongsService();
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();
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
    keys: token.accessTokenAge,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: token.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
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
