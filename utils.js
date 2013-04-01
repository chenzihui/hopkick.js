/*
  Merges two objects, with similar properties on the former object overridden
  in favor of the latter object

  @param {Object}
  @param {Object}

  @return {Object}
*/

module.exports.merge = function( objA, objB ) {
  var key;

  for ( key in objB ) {
    if ( objB.hasOwnProperty( key ) ) {
      objA[ key ] = objB[ key ];
    }
  }

  return objA;
};