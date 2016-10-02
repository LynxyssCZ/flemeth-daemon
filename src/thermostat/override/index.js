'use strict';
const actions = require('./OverrideActions');
const store = require('./OverrideStore');
const api = require('./OverrideApi');

class OverridesManager {
	constructor(app) {
		this.app = app;
		this.logger = app.logger.child({component: 'OverrideManager'});
		this.flux = app.methods.flux;

		this.app.addMethod('override.create', this.createOverride.bind(this));
		this.app.addMethod('override.update', this.updateOverride.bind(this));
		this.app.addMethod('override.remove', this.removeOverride.bind(this));

		app.methods.flux.addStore('Override', store);
		app.methods.api.addEndpoint('override', api);

		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));
		this.app.addHook('lifecycle.stop', this.onAppStop.bind(this));
	}

	createOverride(override, callback) {
		if (override.target) {
			return this.flux.push(actions.createTargetOverride, [override.target, override.reason, override.length], callback);
		}
		else {
			return this.flux.push(actions.createSwitchOverride, [override.switchValue, override.reason, override.length], callback);
		}
	}

	updateOverride(override, callback) {
		return this.flux.push(actions.update, [override.target, override.switchValue, override.reason, override.length], callback);
	}

	removeOverride(callback) {
		return this.flux.push(actions.remove, [], callback);
	}

	onAppStart(payload, next) {
		this.logger.info('Starting');

		this.updateTaskId = global.setInterval(this.update.bind(this), 15000);

		global.setTimeout(next, 0);
	}

	onAppStop(payload, next) {
		this.logger.info('Stopping');

		global.clearInterval(this.updateTaskId);
		global.setTimeout(next, 0);
	}

	update() {
		var override = this.flux.getSlice('Override');

		if (override.get('created') && (override.get('created') + (60 * 1000 * override.get('length'))) < Date.now()) {
			this.removeOverride();
		}
	}
}

module.exports = OverridesManager;
