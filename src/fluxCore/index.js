'use strict';
const Fluxerino = require('fluxerino');
const actions = require('./actions');
const stores = require('./stores');


class Container extends Fluxerino.Container {
	constructor(context, logger) {
		super(context);

		this.logger = logger.child({component: 'FluxCore'});
		this.actions = actions;

		Object.keys(stores).forEach(function registerStore(storeKey) {
			this.addStore(storeKey, stores[storeKey]);
		}, this);
	}

	init(next) {
		this.push('Lifecycle.Init', [], next);
	}

	onTransactionProgress(transaction) {
		this.logger.debug(transaction.type, transaction.payload);
		super.onTransactionProgress(transaction);
	}
}

module.exports = Container;
