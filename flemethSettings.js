'use strict';
class FlemethSettings {
	constructor(options) {
		this.logger = options.logger;
	}

	get() {
		return {
			logger: this.logger,
			server: {
				connection: {
					port: 8098,
					host: '0.0.0.0',
					routes: {
						cors: true
					}
				}
			},
			snapshots: {
				snapshotPeriod: 5 * 1000
			},
			db: require('./knexfile'),
			thermostat: {
				updatePeriod: 15 * 1000,
				lockTime:  5 * 60 * 1000,
				serialPath: process.env.TTY
			}
		};
	}
}

module.exports = FlemethSettings;
