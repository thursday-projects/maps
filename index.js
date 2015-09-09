/**
 * This is the particle constructor. We use this class to represent particles in the system.
 * It gets passed two real numbers, representing X and Y coordinates, and real number representing a mass, and an optional label.
 * @type {Particle}
 */
var Particle = require('./view/particles/particle.js'); 

/**
 * The DynamicalSystem computes and optionally renders the positions of particles based on a dynamics
 * It gets passed an array of particles, representing the system, and a dynamics function.
 * @type {DynamicalSystem}
 */
var DynamicalSystem = require('./view/particles/controller.js');

/**
 * The dynamics indicates how the dynamical system should evolve over time.
 * @type {Dynamics}
 */
var Dynamics = require('./view/particles/dynamics/attractors-repulsors.js');

/**
 * We instantiate the system with a set of particles...
 */
var system = DynamicalSystem(
	[
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x1'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x2'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x3'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x4'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x5'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x1'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x2'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x3'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x4'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x5'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x1'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x2'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x3'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x4'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x5'), 
	],
	Dynamics()
);

/**
 * ...balance the system up to a bound implemented by the passed function...
 */
system.balance( function( p0, p1, i ) {
	var tolerance = 0.05;
	var maxIterations = 1000;

	var xDist = Math.abs( p0.x() - p1.x() ), yDist = Math.abs( p0.y() - p1.y() );

	return (xDist <= tolerance && yDist <= tolerance) || i > maxIterations;
});

/**
 * ...and render the resumt to the document.
 */
system.render( document.body );

