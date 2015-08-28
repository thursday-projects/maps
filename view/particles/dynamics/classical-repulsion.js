"use strict";

module.exports = ClassicalRepulsion;

var Particle = require('../particle.js');

function ClassicalRepulsion(  ) {
	if ( ! (this instanceof ClassicalRepulsion)) { return new ClassicalRepulsion(); }
	var self = this;

	self.dynamics = function( particles ) {
		var G = 25000;

		var newParticles = [];

		particles.forEach( function( p1 ) {

			var vectors = [];

			particles.forEach( function( p2 ) {
				if ( p1 === p2 ) { return; }

				var distanceVector = [p1.x() - p2.x(), p1.y() - p2.y()];

				var norm = Math.sqrt( Math.pow( distanceVector[0], 2) + Math.pow( distanceVector[1], 2) );
				//console.log( "norm: %d", norm);
				// console.log('distance from (%d, %d) to (%d, %d)', p1.x, p1.y, p2.x, p2.y );
				// console.log('|x|: %d, |y|: %d',distanceVector[0], distanceVector[1] );
				// console.log('||(x,y)||: %d', norm);

				var normVector = [distanceVector[0] / norm, distanceVector[1] / norm ];
				//console.log( "vector_x: %d, vector_y: %d", vector[0], vector[1]);


				var force = (p1.m() * p2.m() * G) / Math.pow( norm, 2 );
				//console.log( "coefficient of force: %d", force);

				vectors.push( normVector.map( function( c ) { return c * force; } ) );
			});

			var initialPosition = {x: p1.x(), y: p1.y()};

			var newPosition = vectors.reduce( function( p, c ) { return {x: p.x + c[0], y: p.y + c[1] }; }, initialPosition);

			var newParticle = new Particle( newPosition.x, newPosition.y, p1.m(), p1.name );

			newParticle.previous = p1;
			newParticle.step = p1.step + 1; 
			newParticle.forces = vectors.map( function( force ) {
				return {
					source: {
						x: p1.x(),
						y: p1.y()
					},
					target: {
						x: p1.x() - force[0],
						y: p1.y() - force[1]
					}
				};
			});


			

			newParticles.push( newParticle );
		});

		return newParticles;		
	};

	self.attractors = function() {
		return [];
	};

	self.repulsors = function() {
		return [];
	};

}