var express = require( 'express' ),
    hopkick = require( '../hopkick' ),
    config  = require( '../lib/config' ),
    app     = express();

hopkick.init( config );

hopkick.mount( app );

app.listen( 3000 );

console.log( 'Server has started and is listening on Port 3000' );