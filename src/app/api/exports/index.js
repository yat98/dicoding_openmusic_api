/* c8 ignore next 11 */
import ExportHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'exports',
  version: '1.0.0',
  register: (server, { exportsService, playlistsService, validator }) => {
    const exportHandler = new ExportHandler(exportsService, playlistsService);
    server.route(routes(exportHandler, validator));
  },
};
