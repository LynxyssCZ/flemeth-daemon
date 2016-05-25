'use strict';
const Fluxerino = require('fluxerino');

class Container extends Fluxerino.Container {
	constructor(context, logger) {
		super(context);

		this.logger = logger.child({component: 'FluxCore'});
	}

	init(next) {
		this.push('Lifecycle.Init', [], next);
	}
}

module.exports = Container;
