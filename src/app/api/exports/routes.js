const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
      validate: validator.postExportPlaylistValidation,
    },
  },
];

export default routes;
