"use strict";

var uuid = require('node-uuid');
var d3 = require('d3');
require('d3-grid');

module.exports = BubblesAndArrows;

BubblesAndArrows.prototype.set = set;
BubblesAndArrows.prototype.render = render;


function BubblesAndArrows ( parentSelector ) {
	if ( ! ( this instanceof BubblesAndArrows ) ) return new BubblesAndArrows( parentSelector );
	var self = this;

	this.parent = d3.select( parentSelector );

	this.svg = this.parent.append('svg')
		.attr('class', 'BAA--' + uuid.v4() );

	this.offets = {
		domain: { x: 100, y: 100 },
		codomain: { x: 100, y: 200 }
	};

	this.svg.domain = this.svg.append('g')
		.attr( 'class', 'domain' )
		.attr( 'transform', 'translate( ' + this.offets.domain.x + ' , ' + this.offets.domain.y + ')' );

	this.svg.codomain = this.svg.append('g')
		.attr( 'class', 'codomain' )
		.attr( 'transform', 'translate( ' + this.offets.codomain.x + ' , ' + this.offets.codomain.y + ')' );

	this.elementRadius = 10;
	this.elementDiameter = this.elementRadius * 2;

	this.domainGrid = d3.layout.grid()
		.bands()
		.padding( [10, 10] )
		.nodeSize( [this.elementDiameter, this.elementDiameter] );

	this.codomainGrid = d3.layout.grid()
		.bands()
		.padding( [10, 10] )
		.nodeSize( [this.elementDiameter, this.elementDiameter] );

	return this;
}

function set (d) {
	// d = { domain: [], mapping: [], codomain: [] }
	if ( ! arguments.length ) return this._set;
	
	this._set = d;

	return this;
}

function render () {
	var self = this;

	this.svg
		.attr( 'width', window.innerWidth )
		.attr( 'height', window.innerHeight );

	var domain = this.svg.domain
		.selectAll('.domain-elements')
		.data( this.domainGrid(
					this.set()
						.domain
						.map( function ( id ) {
							return { id: id };
						})
				)
			);

	domain.enter()
		.append( 'circle' )
			.attr( 'class', 'domain-elements' )
			.attr( 'cx', function (d) { return d.x } )
			.attr( 'cy', function (d) { return d.y } )
			.attr( 'r' , this.elementRadius );

	var codomain = this.svg.codomain
		.selectAll( '.codomain-elements' )
		.data( this.codomainGrid(
					this.set()
						.codomain
						.map( function ( id ) {
							return { id: id };
						})
				)
			);

	codomain.enter()
		.append( 'circle' )
			.attr( 'class', 'codomain-elements' )
			.attr( 'cx', function (d) { return d.x } )
			.attr( 'cy', function (d) { return d.y } )
			.attr( 'r' , this.elementRadius );

	var arrowCoordinates = this.set().mapping.map(function (map) {
		// map = ['a', 'x']
		var start,
			end;

		domain.each(function (d) {
			if (d.id === map[0]) start = d;
		});
		codomain.each(function (d) {
			if (d.id === map[1]) end = d;
		});
		return [start, end];
	});

	var arrows = this.svg.selectAll('.arrow')
			.data( arrowCoordinates );

	arrows.enter()
		.append( 'line' )
		.attr( 'class', 'arrow')
		.attr( 'x1', function ( d ) { return d[0].x + self.offets.domain.x; })
		.attr( 'y1', function ( d ) { return d[0].y + self.offets.domain.y; })
		.attr( 'x2', function ( d ) { return d[1].x + self.offets.codomain.x; })
		.attr( 'y2', function ( d ) { return d[1].y + self.offets.codomain.y; })
		.style( 'stroke', 'black' )
		.style( 'stroke-width', '2' );

	
	return this;
}
