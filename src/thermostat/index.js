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
			name: 'overrideManager',
			class: require('./override')
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
		}, {
			name: 'Flemduino',
			class: require('flemeth-arduino'),
			options: {
				path: this.options.serialPath
			}
		}, {
			name: 'Flemeth-Web',
			class: require('flemeth-web'),
			options: {
				base: ''
			}
		}], next);
	}
}

module.exports = Thermostat;
