"use strict";

var uuid = require('node-uuid');
var d3 = require('d3');
var Set = require('./set.js');

module.exports = ClickableSVG;


function ClickableSVG ( parentSelector ) {
	if ( ! ( this instanceof ClickableSVG ) ) return new ClickableSVG( parentSelector );
	var self = this;

	this.parent = d3.select( parentSelector );

	this.svg = this.parent.append('svg')
		.attr('class', 'BAA--' + uuid.v4() )
		.attr('width', window.innerWidth)
		.attr('height', window.innerHeight);

	this.setData = [];

	this.sets = this.svg.selectAll('.set')
		.data(this.setData);

	this.svg
		.on('click', function () {
			var mousePosition = d3.mouse(self.svg.node());
			var newSet = { radius: 100, elements: [] };
			newSet.center = mousePosition;
			self.setData.push(newSet);
			renderSets();
		});

	function renderSets () {
		self.sets = self.svg.selectAll('.set')
			.data(self.setData);

		self.sets
			.enter()
			.append('circle')
				.attr('class', 'set')
				.attr('r', function (d) { return d.radius; })
				.attr('cx', function (d) { return d.center[0]; })
				.attr('cy', function (d) { return d.center[1]; })
				.style({
					'fill': 'transparent',
					'stroke': 'black',
					'stroke-width': 1
				})
				.on('click', function (d, i) {
					d3.event.stopPropagation();
					var mousePosition = d3.mouse(self.svg.node());
					var newElement = { radius: 20 };
					newElement.center = mousePosition;
					d.elements.push(newElement);
					renderSets();
				});


		var boundingBoxes = self.svg.selectAll('.bounding-box')
			.data(self.setData)
			.enter()
			.append('rect')
				.each(function (d) {
					if (d.elements.length > 0) {
						var xs = d.elements.map(function (dd) { return dd.center[0]; });
						var ys = d.elements.map(function (dd) { return dd.center[1]; });
						var minX = d3.min(xs);
						var minY = d3.min(ys);
						var maxX = d3.max(xs);
						var maxY = d3.max(ys);
						d.x = minX;
						d.y = minY;
						d.height = maxY - minY;
						d.width = maxX - minX;
					}
					else {
						d.x = 0;
						d.y = 0;
						d.height = 0;
						d.width = 0;
					}
				})
				.attr('x', function (d) { return d.x; })
				.attr('y', function (d) { return d.y; })
				.attr('width', function (d) { return d.width; })
				.attr('height', function (d) { return d.height; })
				.style({
					'fill': 'transparent',
					'stroke': 'lightgrey',
					'stroke-width': 1
				});

		self.sets
			.transition()
			.duration(300)
			.attr('r', function (d) {
				if (d.elements.length > 1){
					var xs = d.elements.map(function (dd) { return dd.center[0]; });
					var ys = d.elements.map(function (dd) { return dd.center[1]; });
					
					var minX = d3.min(xs);
					var minY = d3.min(ys);
					var maxX = d3.max(xs);
					var maxY = d3.max(ys);

					var padding = 50;
					// divide by 2, as we only want half the distance traveled
					var deltaX = (maxX - minX) / 2;
					var deltaY = (maxY - minY) / 2;

					var radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) + padding;

					console.log(deltaX);
					console.log(deltaY);
					console.log(radius);

					d.radius = radius;

					return radius;
				}
				else {
					return d.radius;
				}
			})
			.attr('cx', function (d) {
				if (d.elements.length > 1) {
					var xs = d.elements.map(function (dd) { return dd.center[0]; });
					var maxX = d3.max(xs);
					var minX = d3.min(xs);
					var centerX = ((maxX - minX) / 2) + minX;
					d.center[0] = centerX;
					return centerX;
				}
				else {
					return d.center[0];
				}
			})
			.attr('cy', function (d) {
				if (d.elements.length > 1) {
					var ys = d.elements.map(function (dd) { return dd.center[1]; });
					var maxY = d3.max(ys);
					var minY = d3.min(ys);
					var centerY = ((maxY - minY) / 2) + minY;
					d.center[1] = centerY;
					return centerY;
				}
				else {
					return d.center[1];
				}
			});

		var elementsData = self.setData
			.map(function (d) { return d.elements; })
			.reduce(function (curr, prev, arr) {
				return prev.concat(curr);
			}, []);

		self.elements = self.svg.selectAll('.element')
			.data(elementsData)
			.enter()
			.append('circle')
				.attr('class', '.element')
				.attr('r', function (d) { return d.radius; })
				.attr('cx', function (d) { return d.center[0]; })
				.attr('cy', function (d) { return d.center[1]; })
				.style({
					'fill': 'black',
					'stroke': 'transparent',
					'stroke-width': 0
				});
	}

	return this;
}
