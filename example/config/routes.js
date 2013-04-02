var routes = {
  '/': {
    'get': 'user#index'
  },

  '/user': {
    'get': 'user#findAll',

    'post': 'user#register'
  }
};

module.exports = routes;