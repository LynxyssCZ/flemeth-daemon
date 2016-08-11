'use strict';
const Fluxerino = require('fluxerino');

class FluxCore {
	constructor(app) {
		this.app = app;
		this.logger = this.app.logger.child({component: 'FluxCore'});

		this.container = new Fluxerino.Container({
			app: this.app
		});

		this.app.addMethod('flux.addStore', this.addStore.bind(this));
		this.app.addMethod('flux.getSlice', this.container.getSlice.bind(this.container));
		this.app.addMethod('flux.subscribe', this.container.subscribe.bind(this.container));
		this.app.addMethod('flux.unsubscribe', this.container.unsubscribe.bind(this.container));
		this.app.addMethod('flux.push', this.container.push.bind(this.container));
		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));
	}

	addStore(key, store) {
		this.app.logExtensionUsage('Store', key);

		this.container.addStore(key, store);
	}

	onAppStart(payload, next) {
		this.container.push('Lifecycle.Init', [], next);
	}
}

module.exports = FluxCore;
