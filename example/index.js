var express = require( 'express' ),
    hopkick = require( '../hopkick' ),
    app     = express();

hopkick.init({
  controllers: './example/controllers/',
  postfix: 'Controller',
  routes: './example/config/routes'
});

hopkick.mount( app );

app.listen( 3000 );

console.log( 'Server has started and is listening on Port 3000' );