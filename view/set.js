"use strict";

var uuid = require('node-uuid');
var d3 = require('d3');

module.exports = Set;


function Set ( center ) {
	if ( ! ( this instanceof Set ) ) return new Set( center );
	var self = this;

	this.radius = 100;
	this.center = center;

	return this;
}
