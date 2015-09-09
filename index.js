
/**
 *  	var model = require('./model/finite-sets')();
 *	var view = require('./view/main')( model );
 * 	var server = require('./server/main')( view );
 */

var FinSet = require('./model/finite-sets.js')();

// Hack up some sets.



var Particle = require('./view/particles/particle.js'); 
var DynamicalSystem = require('./view/particles/controller.js');
var Dynamics = require('./view/particles/dynamics/attractors-repulsors.js');


var system = DynamicalSystem(
	[
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x1'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x2'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x3'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x4'), 
		Particle( window.innerWidth / 4 + Math.random() * (window.innerWidth / 2), window.innerHeight / 4 + Math.random() * (window.innerHeight / 2), 2, 'x5'), 
	],
	Dynamics
);


system.balance( function( p0, p1, i ) {
	var tolerance = 0.05;
	var maxIterations = 1000;


	var xDist = Math.abs( p0.x() - p1.x() ), yDist = Math.abs( p0.y() - p1.y() );


	return (xDist <= tolerance && yDist <= tolerance) || i > maxIterations;
});

system.render( document.body );

