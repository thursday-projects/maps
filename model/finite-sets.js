"use strict";

var uuid = require('node-uuid');

module.exports = function() {

	return {
		is: {
			set: isSet,
			map: isMap
		},
		set: {
			explicit: explicitSet,
			natural: setFromCardinality
		},
		map: {
			explicit: explicitMap,
			random: randomMap
		},
		compose: compose,
		functors: {
			hom: hom
		},
		injections: injections
	};

}


function randomChoice( arr ) {
	return arr[ Math.floor( Math.random() * arr.length ) ];
}

/**
 * This function returns a random identifier for a set element.
 *
 * @return string. A random string. (currently a V4 Universally Unique ID)
 */
function randomName() {
	return uuid.v4();
}

/**
 * str. represent an element as a string.
 *
 * @param x, an object of some kind
 * @return string. A string representation or coercion of x.
 */
function str( x ) {
	return ( x.toString ) ? x.toString() : "" + x;
}

/**
 * equals. deep equality on the set representation
 *
 * @param x, an object of some kind
 * @param y, an object of some kind
 * @return boolean, true if x and y are "the same".
 */
function equals( x, y ) { return x == y; }

/**
 * isSet. This routine returns true if the passed parameter fulfills the specification
 * of a set, which currently just says that it is an array of any type of value.
 * 
 * @param obj, an object to test for set hood
 * @return boolean true if the passed obj is a set
 */
function isSet( obj ) {
	return obj && obj.constructor == Array;
}

/**
 * isMap. This routine returns true if the passed parameter fulfills the specification
 * of a map, which has a domain field, codomain field, and mapping field.
 * 
 * @param obj, an object to test for map hood
 * @return boolean true if the passed obj is a map
 */
function isMap( obj ) {
	return ( obj.domain && isSet( obj.domain )) 
	    && ( obj.codomain && isSet( obj.codomain ) ) 
	    && ( obj.mapping && isSet( obj.mapping ) );
}

/**
 * set.
 * 
 * This function is an interface method that returns the representation we use
 * for sets. Change this function out to change out the representation.
 *
 * @param variadic, elements in the set
 * @return an array with no duplicated elements.
 */
function explicitSet() {
	var noted = {};

	return Array.apply( null, arguments ).filter( function( x ) {
		x = str( x );
		return ( ! noted[ x ] ) ? noted[ x ] = true : ! noted[ x ];
	});
}

/**
 * setFromCardinality.
 * 
 * This function constructs a set from an integer with a number of elements
 *
 * @param variadic, elements in the set
 * @return an array with no duplicated elements.
 */
function setFromCardinality( n ) {
	return Array.apply( null, Array( n ) ).map( function( x ) {
		return randomName();
	});
}

/**
 * 
 */
function explicitMap( domain, mapping, codomain ) {
	return {domain: domain, mapping: mapping, codomain: codomain}
}

/**
 * 
 */
function randomMap( domain, codomain ) {
	return explicitMap( domain, domain.map( function( x ) {
		return [x, randomChoice( codomain )];
	}), codomain);
}

/**
 * element. get an element in a set.
 *
 * @param set, a set to return an element of
 * @return element, an element in the given set.
 */
function element( set ) { return set[0]; }

/**
 * 
 */
function source( arrow ) { return arrow[0]; }

/**
 * 
 */
function target( arrow ) { return arrow[1]; }

/**
 * 
 */
function remove( x, X ) {
	return X.filter( function( e ) { return !equals( x, e ); });
}


/**
 * compose. Given two composable maps f : A --> B, and g : B --> C 
 * produce the unique map gf : A --> C.
 *
 * @param f, a map
 * @param g, a map
 * @return gf, the unique composition of f and g.
 */
 function compose( f, g ) {
 	if ( !equals( f.codomain, g.domain ) ) throw new Error("Non-composable Pair of Maps."); 

 	return explicitMap( f.domain , f.mapping.map( function( f_arr ) {
 
 		var e = g.mapping.filter( function( g_arr ) { return equals( source( g_arr ), target( f_arr ) ); });
 		// DEBUG
 		if ( e.length > 1 ) throw new Error('Malformed Map: ' + str( g.mapping ) );
 		// /DEBUG
 		return [source( f_arr ), target( element( e ) )];

 	}) , g.codomain );
 }

/**
 * combine. This helper routine concatenats a set of maps in a special way,
 * Which resembles the rule for matrix multiplication. Given a pair of sets of maps
 *
 *
 */
function combine( FS, GS ) {
	var combination = [];

	if ( FS.length == 0 ) return GS;
	if ( GS.length == 0 ) return FS;

	FS.forEach( function ( F ) {
		GS.forEach( function ( G ) {
			combination.push( F.concat( G ) );
		})
	});

	return combination; 
}

/**
 * The hom set of two sets X and Y is the set of all functions between from X to Y.
 *
 *
 */
function HOM( X, Y ) {
	if ( X.length == 0 || Y.length == 0) return X;

	if ( X.length == 1 ) {

		var x = element( X );
		return Y.map( function( y ) { return [[x,y]]; }); // changed from var f = {}; f[x] = y; return [f]; }

	} else {

		var x = element( X );
		return combine( HOM([x], Y), HOM( remove(x, X), Y ) );

	}
}

/**
 *
 *
 */
function hom( X,Y ) {
	if ( isSet( X ) && isSet( Y ) ) {
		/**
		 * Hom(X,Y) is the set of all maps between X and Y.
		 */

		return HOM(X,Y).map( function( f ) {
			return explicitMap( X, f, Y );
		});

	} else if ( isSet( X ) && isMap( Y ) ) {
		/**
		 * for f : A -> B, Hom(X,f) : Hom(X,A) -> Hom(X,B),
		 * which associates each map g : X -> A with the map compose( g, f ) : X -> B.
		 */
		// this should be a map from HOM(X, f.domain = A), HOM(X, f.codomain = B)
		var f = Y;
		var A = f.domain;
		var B = f.codomain;

		// Y = f : A --> B
		var homXA = hom( X, A );
		var homXB = hom( X, B );

		return explicitMap(

			homXA,
			homXA.map( function( g ) {
				return [g, compose( g, f )];
			}),
			homXB

		);

	} else if ( isMap( X ) && isSet( Y ) ) {
		/**
		 * for f : A -> B, Hom(f,Y) : Hom(B,Y) -> Hom(A,Y),
		 * which associates each map g : B -> Y with the map compose( f, g ) : A -> Y.
		 *
		 * Hom(f,Y)(g) : Hom(A,Y) = gf : A -> Y : Hom( A,Y )
		 */
		var f = X;
		var A = f.domain;
		var B = f.codomain;

		var homBY = hom( B, Y );
		var homAY = hom( A, Y );

		return explicitMap(

			homBY,
			homBY.map( function( h ) {
				return [h, compose( f, h )];
			}),
			homAY
			
		);



	}

	throw new Error("Can't compute the hom of two maps!");
}

/**
 * The injective functions are the functions f for which f(a) == f(b) implies a == b.
 *
 *
 */
function INJ(X,Y) {
	if ( X.length == 0 || Y.length == 0 || X.length > Y.length) return [];

	if ( X.length == 1 ) {

		var x = element( X );
		return Y.map( function( y ) { return [[x,y]]; });

	} else {

		var x = element( X );
		var xY = INJ( [x], Y ); 

		return xY.reduce( function( p, fn ) {
			var rem = Y;
			fn.forEach( function(arr) { rem = remove( target( arr), rem ); } );


			return p.concat( combine( [fn], INJ( remove(x, X), rem ) ) );
		}, []);
	}
}

function injections( X, Y ) {
	return INJ(X,Y).map( function( f ) {
		return explicitMap( X, f, Y );
	});
}