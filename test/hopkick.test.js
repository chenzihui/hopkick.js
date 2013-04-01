var should  = require( 'should' ),
    assert  = require( 'assert' ),
    utils   = require( '../utils' ),
    hopkick = require( '../hopkick' );

describe( 'Hopkick.js', function() {

  it( 'should be able to be instantiated', function() {
    should.exist( hopkick );
  });

  it( 'should have a default set of configuration options', function() {
    var opts = {
      controllers: './controllers/',
      postfix: 'Controller',
      routes: './config/routes'
    };

    opts.should.eql( hopkick.config );
  });

  it( 'should not expose it\'s map() function to the public', function() {
    should.not.exist( hopkick.map );
  });

});

describe( '._map()', function() {

  var verb       = 'push',
      controller = 'main',
      action     = 'index',
      path       = '/index';

  it( 'should throw an error when an invalid HTTP verb is provided', function() {
    (function() {
      hopkick._map( verb, path, controller, action );
    }).should.throwError( 'Invalid HTTP verb: push' );
  });

  it( 'should throw an error when it cannot load the controller specified', function() {
    var verb = 'get',
        con  = controller + 'Controller';

    (function() {
      hopkick._map( verb, path, controller, action );
    }).should.throwError( 'Cannot load controller ' + con + ' from ./controllers/' );
  });

  it( 'should throw an error when the action does not exist on the controller', function() {
    var verb       = 'get',
        controller = 'user';

    hopkick.config.controllers = './example/controllers/';

    (function() {
      hopkick._map( verb, path, controller, action );
    }).should.throwError( action + ' does not exist on ' + controller + 'Controller' );
  });

});

describe( '.init()', function() {

  it( 'should allow overriding of default options', function() {
    hopkick.init({
      controllers: './app/controllers',
      routes: './routes/index'
    });

    hopkick.config.should.eql({
      controllers: './app/controllers',
      postfix: 'Controller',
      routes: './routes/index'
    });
  });

});

describe( '.mount()', function() {

  it( 'should throw an error when the route map is not found', function() {
    hopkick.config.routes = './example/config/router';

    (function() {
      hopkick.mount();
    }).should.throwError( 'Route map not found!' );
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