// TODO: Clean up the tests!

var should  = require( 'should' ),
    assert  = require( 'assert' ),
    express = require( 'express' ),
    utils   = require( '../utils' ),
    hopkick = require( '../hopkick' );

describe( '.map()', function() {

  var verb       = 'push',
      controller = 'main',
      action     = 'createNew',
      path       = '/index';

  it( 'should throw an error when an invalid HTTP verb is provided', function() {
    var express = require( 'express' ),
        app     = express();

    (function() {
      hopkick.map( app, verb, path, controller, action );
    }).should.throwError( 'Invalid HTTP verb: push' );
  });

  it( 'should throw an error when it cannot load the controller specified', function() {
    var verb    = 'get',
        con     = controller + 'Controller',
        app     = express();

    var hopkick = require( '../hopkick' );

    hopkick.init({
      controllers: './example/controllers/',
      postfix: 'Controller',
      routes: './example/config/routes'
    });

    (function() {
      hopkick.map( app, verb, path, controller, action );
    }).should.throwError( 'Cannot load controller ' + con + ' from ./example/controllers/' );
  });

  it( 'should throw an error when the action does not exist on the controller', function() {
    var verb       = 'get',
        controller = 'user',
        app        = express();

    hopkick.init({
      controllers: './example/controllers/',
      postfix: 'Controller'
    });

    (function() {
      hopkick.map( app, verb, path, controller, action );
    }).should.throwError( action + ' does not exist on ' + controller + 'Controller' );
  });

  it( 'should map a route to a controller\'s action', function() {
    var hopkick = require( '../hopkick' ),
        app     = express();

    hopkick.init({
      controllers: './example/controllers/',
      postfix: 'Controller',
      routes: './example/config/routes'
    });

    hopkick.map( app, 'get', '/', 'user', 'index' );

    var routes = app.routes.get;

    routes[0].path.should.equal( '/' );
    routes[0].method.should.equal( 'get' );
  });

});

describe( '.init()', function() {

  it( 'should throw an error if configuration options are not passed in', function() {
    (function() {
      hopkick.init();
    }).should.throwError( 'Config object not passed into init method' );
  });

  it( 'should accept an object of configuration options', function() {
    var hopkick = require( '../hopkick' );

    hopkick.init({
      controllers: './app/controllers',
      postfix: 'Controller',
      routes: './app/routes'
    });

    hopkick.config.should.eql({
      controllers: './app/controllers',
      postfix: 'Controller',
      routes: './app/routes'
    });
  });

});

describe( '.mount()', function() {
  var app = express();

  it( 'should throw an error when the route map is not found', function() {
    var hopkick = require( '../hopkick' );

    hopkick.init({
      controllers: './example/controllers',
      postfix: 'Controller',
      routes: './example/router'
    });

    (function() {
      hopkick.mount( app );
    }).should.throwError( 'Route map not found!' );
  });

  it( 'should be populated with routes', function() {
    var hopkick = require( '../hopkick' );

    hopkick.init({
      controllers: './example/controllers/',
      postfix: 'Controller',
      routes: './example/config/routes'
    });

    hopkick.mount( app );

    var get  = app.routes.get,
        post = app.routes.post;

    get.should.have.length( 2 );

    get[0].path.should.equal( '/' );
    get[0].method.should.equal( 'get' );

    get[1].path.should.equal( '/user' );
    get[1].method.should.equal( 'get' );

    post.should.have.length( 1 );

    post[0].path.should.equal( '/user' );
    post[0].method.should.equal( 'post' );
  });

});

describe( 'Utilities', function() {

  it( 'should have a method to merge two objects', function() {
    var objA = {
      controllers: '/controllers',
      routes: '/config/routes'
    };

    var objB = {
      controllers: '/app/controllers',
      routes: '/routes/index',
      config: '/config/index'
    };

    var obj = utils.merge( objA, objB );

    obj.should.eql( objB );
  });

  it( 'should not touch existing properties not found on latter object', function() {
    var objA = { controllers: '/controllers', routes: '/config/routes' };

    var objB = { routes: '/routes/index' };

    var obj = utils.merge( objA, objB );

    obj.should.eql( { controllers: '/controllers', routes: '/routes/index' } );
  });

});