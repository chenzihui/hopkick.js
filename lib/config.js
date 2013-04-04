// This is a sample configuration file that is required for Hopkick
// to serve your application routes correctly.

// Configuration options for Hopkick can be included together with your
// application's main configuration file. All that is needed is an object
// within that has `hopkick` as a key and an object as its value.

// EXAMPLE
// --------------------

module.exports = {
  host: 'localhost',
  port: '4000',

  hopkick: {
    controllersPath: '/example/controllers',
    controllerPostfix: 'Controller',
    routeMap: '/example/config/routes'
  }
};