# What is this?
------------------------------

Hopkick.js is a simple router built on top of Express.js that allows us to declare expressive route maps.

Instead of

    var express = require( 'express' ),
        app     = express();

    app.get( '/', function( req, res ) {
      // Logic
    });

    app.post( '/user', function( req, res ) {
      // Logic
    });

We can now express our routes as

    var routes = {
      '/': {
        'get': 'main#index' // controller#action
      },

      '/user': {
        'get': 'user', // By leaving out the action, defaults to `index`

        'post': 'user#createNew'
      }
    };

# Why create this?
------------------------------

This is a side project for me to (re)experience TDD.