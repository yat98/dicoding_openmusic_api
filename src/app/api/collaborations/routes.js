const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: 'openmusic_jwt',
      validate: validator.postCollaborationValidation,
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'openmusic_jwt',
      validate: validator.deleteCollaborationValidation,
    },
  },
];

export default routes;
