/* c8 ignore next 11 */
import AlbumHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {service, validator}) => {
    const albumHandler = new AlbumHandler(service);
    server.route(routes(albumHandler, validator));
  },
};