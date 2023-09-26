/* c8 ignore next 6 */
import Hapi from '@hapi/hapi';
import app from '../config/app.js';
import AlbumService from './services/postgres/AlbumService.js';
import albumValidator from './validators/albums/index.js';
import albumPlugin from './api/albums/index.js';
import NotFoundError from './exceptions/NotFoundException.js';

const albumService = new AlbumService();
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
      plugin: albumPlugin,
      options: {
        service: albumService,
        validator: albumValidator,
      }
    }
  ])
}

/* c8 ignore next 40 */
server.ext('onPreResponse', (req, h) => {
  const {response} = req;

  if(response instanceof Error) {
    if(response instanceof NotFoundError) {
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
    if(app.mode === 'production'){
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
