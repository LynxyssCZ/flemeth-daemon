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
		const zonesMean = this.flux.getSlice('ZonesMean').get('temperature');
		const target = this.flux.getSlice('ScheduleTarget').toJS();
		const state = this.flux.getSlice('TempChecker').toJS();
		let newState;
		let rising;

		if (!zonesMean || !target.temperature) {
			return;
		}

		if (state.rising === true && zonesMean > (target.temperature + target.hysteresis)) {
			newState = true;
			rising = false;
		}
		else if (state.rising === false && zonesMean < (target.temperature - target.hysteresis)) {
			newState = false;
			rising = true;
		}
		else {
			return;
		}

		if (newState !== state.state || rising !== state.rising) {
			return this.flux.push(TempCheckerActions.updateState, [newState, rising]);
		}
	}
}

module.exports = TemperatureChecker;
