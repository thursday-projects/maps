var FinSet = require('./model/finite-sets')();

// Hack up some sets.
var A = FinSet.set.explicit( 'a', 'b' );
var B = FinSet.set.explicit( 'x', 'y', 'z', 'zz' );
var C = FinSet.set.explicit( 'l','m','n', 'o' );

var f = FinSet.map.random( A, B );
var g = FinSet.map.random( B, C );
var h = FinSet.map.random( A, A );

console.log( "\nA = " + A );
console.log( "\nB = " + B );


console.log('\nh : A --> A:');
console.log( JSON.stringify( h.mapping ) );
console.log('\n\nhom(A,h) : hom(A,A) --> hom(A,A)');
console.log( JSON.stringify( FinSet.functors.hom( A,h ).mapping, null, 2 ) );

// Generate the set of functions between them. 
// ( Just show us the mappings, not the domain and codomain )
// console.log( "\nhom( A, B ) = " );
// console.log( FinSet.hom( B, A ).map( function( m ) { return m.mapping; }) );

// Generate the set of injections between them. 
// ( Just show us the mappings, not the domain and codomain )
// console.log( "\ninjections( A, B ) =" );
// console.log( FinSet.injections( B, A ).map( function( m ) { return m.mapping; }) );

var ColorGrid = require('./view/color-grid.js');
var BubblesAndArrows = require('./view/bubbles-and-arrows.js');
var ClickableSVG = require('./view/clickable-svg.js');

var canvas = ClickableSVG( document.body );

// FinSet.functors.hom( C, B ).forEach( function ( set ) {
// 	BubblesAndArrows( document.body )
// 		.set( set )
// 		.render();
// });

// ColorGrid( document.body )
// 	.set( g )
// 	.render();

// ColorGrid( document.body )
// 	.set( h )
// 	.render();