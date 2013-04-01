/**
 * Hopkick.js - A simple router built on top of Express.js
 *
 * Author: Chen Zihui <hello@chenzihui.com>
 **/

var utils   = require( './utils' ),
    express = require( 'express' ),
    app     = express();

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

    @param {String} - HTTP verb
    @param {String} - Route path
    @param {String} - Name of controller
    @param {String} - Action

    @return none
  */

  var _map = function( verb, path, controller, action ) {
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

  return {
    config: {
      // Path where your controllers are stored in
      controllers: './controllers/',

      // Naming of your controller e.g. `UserController`
      postfix: 'Controller',

      // Location of your route map
      routes: './config/routes'
    },

    /*
      Initializes the router with configuration options

      @param {Object}
    */

    init: function( opts ) {
      this.config = opts ? utils.merge( this.config, opts ) : this.config;
    },

    /*
      Mounts the router onto the route map specified
    */

    mount: function() {
      var routeMap, route, handler, method, controllerName, actionName;

      try {
        routeMap = require( this.config.routes );
      } catch ( e ) {
        throw new Error( 'Route map not found!' );
      }

      for ( route in routeMap ) {
        handler = routeMap[ route ];

        for ( method in handler ) {
          controllerName = handler[method].split( '#' )[0];

          actionName = handler[method].split( '#' )[1] ?
              handler[method].split( '#' )[1] : 'index';

          _map( method, route, controllerName, actionName );
        }
      }
    },

    /**
     * Private API (For tests)
     **/

    _map: _map

    /**
     * End Private API
     **/
  };

})();

module.exports = hopkick;