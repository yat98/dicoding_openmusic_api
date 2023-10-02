const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      validate: validator.postUserValidation,
    },
  },
];

export default routes;
