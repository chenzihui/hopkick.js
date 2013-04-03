/**
 * Hopkick.js - A simple router built on top of Express.js
 *
 * Author: Chen Zihui <hello@chenzihui.com>
 **/

var utils   = require( './utils' );

var hopkick = (function() {

  /*
    Loads a controller from the specified path
    TODO: Can be expanded to load other types of files. E.g. `models`

    @param {String} - Name of controller
    @param {String} - Path
    @param {String} - Postfix of file

    @returns {Object}
  */

  var _loadFile = function( name, path, postfix ) {
    var fullname = name + postfix,
        controller;

    try {
      controller = require( path + fullname );
    } catch ( e ) {
      throw new Error( 'Cannot load controller ' + fullname + ' from ' + path );
    }

    return controller;
  };

  /*
    Maps the route to a controller's action

    @param {Object} - Express app
    @param {String} - HTTP verb
    @param {String} - Route path
    @param {String} - Name of controller
    @param {String} - Action

    @return none
  */

  var map = function( app, verb, path, controller, action ) {
    var allowedVerbs = [ 'get', 'post', 'put', 'delete' ],
        verb         = verb.toLowerCase(),
        con;

    if ( allowedVerbs.indexOf( verb ) === -1 ) {
      throw new Error( 'Invalid HTTP verb: ' + verb );
    }

    con = _loadFile( controller, this.config.controllers, this.config.postfix );

    if ( !con[action] ) {
      throw new Error( action + ' does not exist on ' + controller + 'Controller' );
    }

    app[verb]( path, con[action] );
  };

  /*
    Mounts the router onto the route map specified

    @param {Object} - Express application
  */

  var mount = function( app ) {
    var routeMap, route, handler, method, controllerName, actionName;

    try {
      routeMap = require( this.config.routes );
    } catch ( e ) {
      throw new Error( 'Route map not found!' );
    }

    // TODO: Abstract this portion out

    for ( route in routeMap ) {
      handler = routeMap[ route ];

      for ( method in handler ) {
        if ( utils.isFunction( handler[method] ) ) {

          // Do the mapping directly
          app[method]( route, handler[method] );
        } else {

          // Parse the string and apply mapping
          controllerName = handler[method].split( '#' )[0];

          actionName = handler[method].split( '#' )[1] ?
              handler[method].split( '#' )[1] : 'index';

          this.map( app, method, route, controllerName, actionName );
        }
      }
    }
  };

  return {

    config: {},

    /*
      Initializes the router with configuration options

      @param {Object}

      Example usage:

      hopkick.init({
        // Path to controllers
        controllers: './app/controllers/',

        // Postfix for controller files
        postfix: 'Controller',

        // Path to route map
        routes: './app/routes'
      });
    */

    init: function( opts ) {
      if ( !opts ) {
        throw new Error( 'Config object not passed into init method' );
      }

      this.config = opts;
    },

    /*
      Public API
    */

    map: map,
    mount:mount
  };

})();

module.exports = hopkick;