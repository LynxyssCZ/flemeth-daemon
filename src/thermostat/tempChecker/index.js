'use strict';
const TempCheckerStore = require('./TempCheckerStore');
const TempCheckerActions = require('./TempCheckerActions');
const TempCheckerApi = require('./TempCheckerApi');

class TemperatureChecker {
	constructor(app) {
		this.app = app;
		this.logger = app.logger.child({component: 'TemperatureChecker'});
		this.flux = app.methods.flux;

		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));
		this.app.addHook('lifecycle.stop', this.onAppStop.bind(this));

		this.app.methods.flux.addStore('TempChecker', TempCheckerStore);
		this.app.methods.api.addEndpoint('tempchecker', TempCheckerApi);

	}

	// Hooks
	onAppStart(payload, next) {
		this.logger.info('Starting');

		this.subscriptionKey = this.flux.subscribe(this.updateState.bind(this), [
			'ZonesMean', 'ScheduleTarget'
		]);

		next();
	}

	onAppStop(payload, next) {
		this.logger.info('Stopping');
		this.flux.unsubscribe(this.subscriptionKey);
		next();
	}

	updateState() {

	}
}

module.exports = TemperatureChecker;
