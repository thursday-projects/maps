"use strict";

module.exports = Particle;

function Particle( x, y, m, name ) {
	if ( ! (this instanceof Particle) ) { return new Particle( x, y, m, name ); }

	var self = this;

	self.name = name;

	self.previous = undefined;

	self.step = 0;

	self.forces = [];

	self.x = function ( newX ) { if ( newX !== undefined ) { x = newX; } return x; };

	self.y = function ( newY ) { if ( newY !== undefined ) { y = newY; } return y; };

	self.m = function ( newM ) { if ( newM !== undefined ) { m = newM; } return m; };

}