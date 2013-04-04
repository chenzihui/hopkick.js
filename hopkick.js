/**
 * Hopkick.js - A simple router built on top of Express.js
 *
 * Example usage:
 *
 * var express = require( 'express' ),
 *     hopkick = require( 'hopkick' ),
 *     config  = require( './lib/config' ),  // Configuration file for your app
 *     app     = express();
 *
 * // Initialize the router
 * hopkick.init( config );
 *
 * // Mount your application routes
 * hopkick.mount( app );
 *
 * Author: Chen Zihui <hello@chenzihui.com>
 **/

var utils   = require( './lib/utils' );

var hopkick = (function( undefined ) {

  /*
    Private variable to store the configuration options
  */

  var _config = {};

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
    Initializes the router with your configuration options

    @param {Object}
  */

  var init = function( opts ) {
    if ( !opts ) {
      throw new Error( 'Config object not passed into init method' );
    }

    if ( opts.hopkick === undefined ) {
      throw new Error( 'Cannot find Hopkick configuration options' );
    }

    utils.merge( _config, opts.hopkick );
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

    /*
      Public API
    */

    init: init,
    map: map,
    mount:mount,

    /*
      Private API (For tests only)
    */
    _config: _config
  };

})( undefined );

module.exports = hopkick;