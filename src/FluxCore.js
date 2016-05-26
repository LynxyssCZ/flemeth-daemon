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

	addStore(key, store) {
		this.logger.debug({
			key: key
		}, 'Store registered');

		super.addStore(key, store);
	}
}

module.exports = Container;
