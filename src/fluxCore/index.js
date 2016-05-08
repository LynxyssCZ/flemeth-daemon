'use strict';
var Fluxerino = require('fluxerino');
var actions = require('./actions');

class Container extends Fluxerino.Container {
	constructor(context) {
		super(context);

		this.actions = actions;
		this.init();
	}

	init() {
		this.push('Lifecycle.Init');
	}
}

module.exports = Container;
