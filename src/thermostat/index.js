'use strict';

class Thermostat {
	constructor(app, options) {
		this.app = app;
		this.options = options;
	}

	init(next) {
		this.app.register([{
			name: 'sensorsManager',
			class: require('./sensors')
		}, {
			name: 'zonesManager',
			class: require('./zones')
		}, {
			name: 'scheduleManager',
			class: require('./schedule'),
			options: {
				updatePeriod: this.options.updatePeriod
			}
		}, {
			name: 'temperatureChecker',
			class: require('./tempChecker')
		}, {
			name: 'switcher',
			class: require('./switcher'),
			options: {
				lockTime: this.options.lockTime
			}
		}], next);
	}
}

module.exports = Thermostat;
