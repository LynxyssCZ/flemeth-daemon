'use strict';
var Knex = require('knex');

class FlemethSettings {
	constructor(options) {
		this.logger = options.logger;
		this.knex = new Knex(require('./knexfile'));
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
			db: this.knex,
			thermostat: {
				updatePeriod: 15 * 1000,
				snapshotPeriod: 5 * 1000,
				lockTime:  5 * 60 * 1000
			}
		};
	}

	destroy() {
		this.knex.destroy();
	}
}

module.exports = FlemethSettings;
