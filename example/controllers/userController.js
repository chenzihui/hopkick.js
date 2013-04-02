var userController = {
  index: function( req, res ) {
    res.send( 'Hello World' );
    res.end();
  }
};

module.exports = userController;