"use strict";

var d3 = require('d3');

module.exports = DynamicalSystem;

/**
 * @class The Particle Controller implements a framework for a
 * dynamical system that sets the position of particles based on
 * a time-indexed step function. This class provides a wrapping later to that function
 *
 */
function DynamicalSystem ( particles, dynamics ) {
	if ( ! (this instanceof DynamicalSystem) ) { return new DynamicalSystem( particles, dynamics ); }
	var self = this;


	/**
	 * The current step in the dynamics of this system
	 * @type {Number}
	 */
	self.timestep = 0;

	/**
	 * the dynamics of this system. By default, this is the identity function.
	 * 
	 * @param  {[Particles]} x The current state of the system.
	 * @param  {Int} t the current timestep of the system.
	 * @return {[Particles]}   The next state of the system.
	 */
	self.dynamics = ( dynamics ) ? dynamics.dynamics : require('./dynamics/identity.js');


	/**
	 * the set of all positions that particles have occupied over the course of the dynamics.
	 * Used of drawing and debugging the dynamics
	 * 
	 * @type {[[Particle]]}
	 */
	self.history = [particles];

	/**
	 * The set of particle objects that this dynamical system is currently acting on.
	 * The current state of the system.
	 * 
	 * @type {[Particle]}
	 */
	self.particles = particles;

	/**
	 * [step description]
	 * @param  {f : [Particle] x Int -> [Particle]}
	 * @return {[Particle]}   [description]
	 */
	self.step = function( f ) {

		self.timestep += 1;

		if ( typeof f === Function ) {

			self.dynamics = f.dynamics;
			
		} else if ( f !== undefined || self.dynamics === undefined ) {

			throw new Error("DynamicalSystem: The specificed dynamics is not a function.");

		}

		self.particles = self.dynamics( self.particles, self.timestep );

		self.history.push( self.particles );

		return self.particles;
	};

	/**
	 * The balance routine runs the simulation until an equilibrium is found to within the
	 * bound specified by the supplied acceptance function.
	 *
	 * 
	 * @param  {[Particle x Particle x Int] -> Boolean} accepted [description]
	 * @return {[type]}          [description]
	 */
	self.balance = function( accepted ) {

		while ( self.particles.every( function( particle ) {
			if ( particle.previous ) {

				return ! accepted( particle.previous, particle, self.timestep );

			} else {
				return true;
			}

		} ) ) {

			self.step();

		}

		return self.particles;
	};

	/**
	 * Render an abstract description of the particle system to an svg element.
	 * Useful for debugging.
	 * 
	 * @param  {[type]} parent parent element to render into
	 */
	self.render = function( parent ) {

		var history = self.history.reduce( function( p, c ) {return p.concat( c ); }, [] );

		//history = history.filter( function( p ) { return p.step === self.timestep || p.step === 0; });

		var velocityBounds = history.reduce( function( p, c ) {

			if ( c.previous !== undefined ) {

				var norm = Math.sqrt( Math.pow( ( c.x() - c.previous.x() ), 2) + Math.pow( (c.y() - c.previous.y()), 2) );

				return [ ( norm < p[ 0 ])  ? norm  : p[0], (norm > p[1]) ? norm : p[1] ];


			} else {

				return p;
			}

		}, [Infinity, -Infinity] );

		var velocityScale = d3.scale.linear().domain( velocityBounds ).range(['green','yellow']);

		var opacityScale = d3.scale.linear().domain( [0, self.timestep ]).range([0.25,1]);

		//var forceScale = d3.scale.linear().domain( [0, self.timestep ]).range([0.25,0.75]);

		var forceColor = "red";


		var svg = d3.select( parent ).append( 'svg' )
					.attr('width', window.innerWidth )
					.attr('height', window.innerHeight );

		svg.append('defs')
				.append('marker')
					.attr('id', 'force')
					.attr('orient', 'auto')
					.append('path')
						.attr('markerWidth', 2)
						.attr('markerHeight', 4)
						.attr('refX', 0.1)
						.attr('refY',2)
						.attr('d', 'M0,0 V4 L2,2 Z')
						.attr('fill', forceColor);



		var attractors = svg.selectAll('.attractor' ).data( dynamics.attractors().map( function( attractor ) {
			return {
				x: attractor.x(),
				y: attractor.y(),
				m: attractor.m() 
			};
		}));

		var repulsors = svg.selectAll('.repulsors' ).data( dynamics.repulsors().map( function( repulsor ) {
			return {
				x: repulsor.x(),
				y: repulsor.y(),
				m: repulsor.m()
			};
		}));

		var particles = svg.selectAll('.particle').data( history.map( function( particle ) {
			var vel = ( particle.previous ) ? Math.sqrt( Math.pow( ( particle.x() - particle.previous.x() ), 2) + Math.pow( (particle.y() - particle.previous.y()), 2) ) : 0;

			return {
				x: particle.x(),
				y: particle.y(),
				m: particle.m(),
				v: vel,
				step: particle.step
			};
		}) );

		var arrows = svg.selectAll('.arrow').data( history.map( function ( particle ) {
			if ( particle.previous !== undefined ) {
				var vel = ( particle.previous ) ? Math.sqrt( Math.pow( ( particle.x() - particle.previous.x() ), 2) + Math.pow( (particle.y() - particle.previous.y()), 2) ) : 0;
				return {
					source: {
						x: particle.previous.x(),
						y: particle.previous.y()
					},
					target: {
						x: particle.x(),
						y: particle.y()
					},
					v: vel,
					step: particle.step
				};
			} else {
				return undefined;
			}
		} ).filter( function( arrow ) {
			return arrow !== undefined;
		}) );

		var forces = svg.selectAll( '.force' ).data( history.map( function( particle ) {
			if ( particle.previous !== undefined ) {
				return particle.forces;
			} else {
				return undefined;
			}
		}).filter( function( force ) {
			return force !== undefined; 
		}).reduce( function( p,c ) {
			return p.concat( c );
		}, []));

		var labels = svg.selectAll('.label').data( history.map( function( particle ) {
			return {
				label: particle.name + ' - ' + particle.step,
				x: particle.x() - 20,
				y: particle.y() + 20,
				show: false
			};
		}).concat([
			{
				label: 'Coefficient Of Friction: ' + dynamics.coefficientOfFriction(),
				x: 20,
				y: window.innerHeight * 0.95,
				show: true
			},
			{
				label: 'Coefficient Of Attraction: ' + dynamics.coefficientOfAttraction(),
				x: 20,
				y: window.innerHeight * 0.95 - 20,
				show: true
			},
			{
				label: 'Coefficient Of Repulsion: ' + dynamics.coefficientOfRepulsion(),
				x: 20,
				y: window.innerHeight * 0.95 - 40,
				show: true
			},
			{
				label: 'Iterations: ' + self.timestep,
				x: 20,
				y: window.innerHeight * 0.95 - 60,
				show: true
			}
		]));

		attractors 	.enter()
				.append('circle')
				.classed({'attractor': true})
				.attr('r', function( d) { return d.m; })
				.attr( 'cx', function( d ) { return d.x; })
				.attr( 'cy', function( d ) { return d.y; })
				.attr( 'fill', 'lightpink');

		repulsors 	.enter()
				.append('circle')
				.classed({'repulsor': true})
				.attr('r', function( d) { return d.m; })
				.attr( 'cx', function( d ) { return d.x; })
				.attr( 'cy', function( d ) { return d.y; })
				.attr( 'fill', 'lightblue');

		forces 	.enter()
				.append('line')
				.attr( 'class', function( d ) { return 'dynamic force step-' + d.step;  } )				
				.attr('x1', function( d ) { return d.source.x; })
				.attr('y1', function( d ) { return d.source.y; })
				.attr('x2', function( d ) { return d.target.x; })
				.attr('y2', function( d ) { return d.target.y; })
				.attr('marker-end', 'url(#force)')
				.attr('stroke', forceColor)
				.attr('stroke-width', 0.25 );
				//.style( 'stroke-opacity', function( particle ) { return forceScale( particle.step ); });
				//.style('display', 'none');

		arrows	.enter()
				.append( 'line' )
				.attr( 'class', function( d ) { return 'dynamic arrow step-' + d.step;  } )		
				.attr('x1', function(d) {return d.source.x; })
				.attr('y1', function(d) {return d.source.y; })
				.attr('x2', function(d) {return d.target.x; })
				.attr('y2', function(d) {return d.target.y; })
				.attr('stroke', function( d ) { return velocityScale( d.v ); })
				.style( 'stroke-opacity', function( particle ) { return opacityScale( particle.step ); });

		particles 	.enter()
				.append('circle')
				.attr( 'class', function( d ) { return 'dynamic particle step-' + d.step;  } )
				.attr( 'r', function( particle ) { return particle.m; })
				.attr( 'cx', function( particle ) { return particle.x; })
				.attr( 'cy', function( particle ) { return particle.y; })
				.attr( 'fill', function( particle ) { return velocityScale( particle.v ); })
				.style( 'fill-opacity', function( particle ) { return opacityScale( particle.step ); });


		labels 	.enter()
				.append('text')
				.attr( 'class', function( d ) { return 'dynamic label step-' + d.step;  } )		
				.attr('x', function( d ) { return d.x; })
				.attr('y', function( d ) { return d.y; })
				.attr('font-family', 'Verdana')
				.attr('font-size', 7)
				.text( function( d ) { return d.label; })
				.style('display', function( d ) { return ( d.show ) ? "" : "none"; });
				

	};


	return self;
}