"use strict";

var Vector = require('vector2d');

var Particle = require('../particle.js');

module.exports = AttractionAndRepulsion;

function AttractionAndRepulsion(  ) {
	if ( ! (this instanceof AttractionAndRepulsion) ) { return new AttractionAndRepulsion(  ); }
	var self = this;

	/**
	 * The Coefficient of Attraction. A scalar quantity answering the questions:
	 * "How important is the Rule of Attraction in determining the motion of particles".
	 * 
	 * @type {Number}
	 */
	var C_a = 10;

	/**
	 * The coefficient of Repulsion. A scalar quantity answering the question:
	 * "How important is the Rule of Repulsion in determining the motion of particles"
	 * 
	 * @type {Number}
	 */
	var C_r = 20;

	/**
	 * The Coefficient of Friction. A scalar quantity determining how much a free particle's
	 * Mass determines motion.
	 * 
	 * @type {Number}
	 */
	var C_f = 2;


	var attractors = [
		new Particle( window.innerWidth * 1 / 4 + 300, window.innerHeight * 1 / 4,50,'A1' ), // [0]
		// new Particle( window.innerWidth * 1 / 4, window.innerHeight * 3 / 4,50,'A1' ), // [0]
		// new Particle( window.innerWidth * 3 / 4,window.innerHeight * 1 / 4,50,'A1' ), // [0]
		// new Particle( window.innerWidth * 3 / 4,window.innerHeight * 3 / 4,50,'A1' ), // [0]
	];

	 var repulsors = [
		new Particle( window.innerWidth * 1 / 4 + 250,window.innerHeight * 1 / 4,10,'R1' ), 
		new Particle( window.innerWidth * 1 / 4 + 350 ,window.innerHeight * 1 / 4,10,'R1' ), 
		new Particle( window.innerWidth * 1 / 4 + 300,window.innerHeight * 1 / 4,10,'R1' ), 
		//new Particle( window.innerWidth * 1 / 4 + 300 ,window.innerHeight * 1 / 4 - 100,10,'R1' ),
		// new Particle( window.innerWidth * 1 / 2 - 100 ,300,10,'R1' ), 
		// new Particle( window.innerWidth * 1 / 2 + 100,300,10,'R1' ), 
	 ];


	self.dynamics = function( particles ) {
		var newParticles = [];

		particles.forEach( function( P ) {

			var particlePosition = Vector.ObjectVector( P.x(), P.y() );

			var attractions = attractors.map(function( A ) {
				var attractorPosition = Vector.ObjectVector( A.x(), A.y() );

				var distance = particlePosition.distance( attractorPosition );
				var direction = attractorPosition.clone().subtract( particlePosition );

				var force = distance * (C_a / A.m()) * (C_f / P.m());
				//var force = distance * (A.m() / C_a) * ( P.m() / C_f);

				return direction.normalize().mulS( force );
			});

			var repulsions = repulsors.concat( particles.filter( function( P2 ) { return P !== P2; })).map( function( R ) {
				var repulsorPosition = Vector.ObjectVector( R.x(), R.y() );

				var distance = particlePosition.distance( repulsorPosition );
				var direction = particlePosition.clone().subtract( repulsorPosition );

				var force = (  C_r / distance * R.m() ) / (C_f / P.m());
				//var force = ( (distance * R.m()) /  C_r ) / (P.m() / C_f );

				return direction.normalize().mulS( force );
			});


			var newPosition = attractions.concat( repulsions ).reduce( function( p , c ) {
				return p.add( c );
			}, particlePosition).toObject();

			var newParticle = new Particle( newPosition.x, newPosition.y, P.m(), P.name );

			newParticle.previous = P;
			newParticle.step = P.step + 1;
			newParticle.forces = attractions.map( function( vec ) {
				var vecArr = vec.toArray();

				return {
					source: {
						x: P.x() - vecArr[0],
						y: P.y() - vecArr[1]
					},
					target: {
						x: P.x(),
						y: P.y()
					}
				};

			}).concat( repulsions.map( function( vec ) {
				var vecArr = vec.toArray();

				return {
					source: {
						x: P.x(),
						y: P.y()
					},
					target: {
						x: P.x() - vecArr[0],
						y: P.y() - vecArr[1]
					}
				};

			}));

			newParticles.push( newParticle );
		});

		return newParticles;

	};

	/**
	 * getter/setter for the set of attractors used by this Dynamics.
	 * 
	 * @param  {[Particle] | undefined} updated the new set of attractors
	 * @return {[Particle]}         the current set of attractors.
	 */
	self.attractors = function( updated ) {
		if ( updated !== undefined ) {
			attractors = updated;
		}

		return attractors;
	};

	/**
	 * getter/setter for the set of repulsors used by this Dynamics.
	 * 
	 * @param  {[Particle] | undefined} updated the new set of repulsors
	 * @return {[Particle]}         the current set of repulsors.
	 */
	self.repulsors = function( updated ) {
		if ( updated !== undefined ) {
			repulsors = updated;
		}

		return repulsors;
	};

	self.coefficientOfFriction = function( ) {
		return C_f;
	};

	self.coefficientOfAttraction = function( ) {
		return C_a;
	};

	self.coefficientOfRepulsion = function( ) {
		return C_r;
	};

	return this;
}