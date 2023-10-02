const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler,
    options: {
      validate: validator.postAuthenticationValidation,
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler,
    options: {
      validate: validator.putAuthenticationValidation,
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
    options: {
      validate: validator.deleteAuthenticationValidation,
    },
  },
];

export default routes;
