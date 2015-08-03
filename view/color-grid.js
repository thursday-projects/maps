"use strict";

var uuid = require('node-uuid');
var d3 = require('d3');
require('d3-grid');

module.exports = ColorGrid;

ColorGrid.prototype.set = set;
ColorGrid.prototype.render = render;


function ColorGrid ( parentSelector ) {
	if ( ! ( this instanceof ColorGrid ) ) return new ColorGrid( parentSelector );
	var self = this;

	this.parent = d3.select( parentSelector );

	this.svg = this.parent.append('svg')
		.attr('class', 'graph--' + uuid.v4() );

	this.grid = d3.layout.grid()
		.bands()
		.padding( [0, 0] );

	this.color = d3.scale.linear()
        .domain( [0, 1] )
        .interpolate( d3.interpolateHsl )
        .range( [
            "hsl(62,100%,90%)",
            "hsl(222,30%,20%)"] );

	return this;
}

function set (d) {
	// d = { domain: [], mapping: [], codomain: [] }
	if ( ! arguments.length ) return this._set;
	
	this._set = d;
	this.color.domain( [0, this._set.domain.length] );

	return this;
}

function render () {
	var self = this;

	var bounds = this.parent.node().getBoundingClientRect();
	var halfWidth = bounds.width / 2;

	this.svg.attr('width', bounds.width)
			.attr('height', bounds.height);

	this.grid.size( [halfWidth, bounds.height] );

	var domain = this.svg
		.selectAll('.domain')
		.data(
			this.grid(
				this.set()
					.domain
					.map(function ( id ) {
						return { id: id };
					})
				)
			);

	domain.enter()
		.append( 'rect' )
		.attr( 'class', 'domain' )
		.attr( 'transform', function ( d, i ) {
			return 'translate(' + d.x + ',' + d.y + ')';
		})
		.attr( 'width', this.grid.nodeSize()[0] )
		.attr( 'height', this.grid.nodeSize()[1] )
		.style( 'fill', function ( d, i ) {
			var count = 1;
			var c = d3.rgb(self.color(count));
            return 'rgb(' + [c.r, c.g, c.b].join(', ') + ')';
		});

	domain.transition()
		.duration(280)
		.attr( 'transform', function ( d, i ) {
			return 'translate(' + d.x + ',' + d.y + ')';
		} )
		.attr( 'width', this.grid.nodeSize()[0] )
		.attr( 'height', this.grid.nodeSize()[1] );

	domain.exit().remove();

	var codomain = this.svg
		.selectAll( '.codomain' )
		.data(
			this.grid(
				this.set()
					.codomain
					.map(function ( id ) {
						return { id: id };
					} )
				)
			);

	codomain.enter()
		.append( 'rect' )
		.attr( 'class', 'codomain' )
		.attr( 'transform', function ( d, i ) {
			return 'translate(' + (d.x + halfWidth) + ',' + d.y + ')';
		})
		.attr( 'width', this.grid.nodeSize()[0] )
		.attr( 'height', this.grid.nodeSize()[1] )
		.style( 'fill', function ( d, i ) {
			var count = 0;
			self.set().mapping.forEach( function ( ss ) {
				if ( ss[1] === d.id ) {
					count += 1;
				}
			} );
			var c = d3.rgb(self.color(count));
            return 'rgb(' + [c.r, c.g, c.b].join( ', ' ) + ')';
		});

	codomain.transition()
		.duration(280)
		.attr( 'transform', function ( d, i ) {
			return 'translate(' + (d.x + halfWidth) + ',' + d.y + ')';
		})
		.attr( 'width', this.grid.nodeSize()[0] )
		.attr( 'height', this.grid.nodeSize()[1] );


	codomain.exit().remove();

	return this;
}
