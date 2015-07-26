var FinSet = require('./model/finite-sets')();

// Hack up some sets.
var A = FinSet.set.explicit( 'a', 'b', 'c', 'd', 'e' );
var B = FinSet.set.explicit( 'x', 'y' );

console.log( "\nA = " + A );
console.log( "\nB = " + B );

// Generate the set of functions between them. 
// ( Just show us the mappings, not the domain and codomain )
console.log( "\nhom( A, B ) = " );
console.log( FinSet.hom( B, A ).map( function( m ) { return m.mapping; }) );

// Generate the set of injections between them. 
// ( Just show us the mappings, not the domain and codomain )
console.log( "\ninjections( A, B ) =" );
console.log( FinSet.injections( B, A ).map( function( m ) { return m.mapping; }) );