'use strict';
const api = require('./api');

class FlemethApi {
	constructor(app, options) {
		this.app = app;
		this.options = options;
		this.logger = app.logger.child({component: 'FlemethApi'});
	}

	init(next) {
		this.logger.info('Initializing');

		this.app.server.register([{
			register: api,
			options: {
				base: this.options.apiPrefix,
				app: this.app
			}
		}], next);
	}
}

FlemethApi.attributes = api.register.attributes;

module.exports = FlemethApi;
