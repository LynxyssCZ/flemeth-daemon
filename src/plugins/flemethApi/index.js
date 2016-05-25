'use strict';

class FlemethApi {
	constructor(app, options) {
		this.app = app;
		this.options = options;
		this.logger = app.logger.child({component: 'FlemethApi'});

		this.registerToServer = this.registerToServer.bind(this);
		this.registerToServer.attributes = FlemethApi.attributes;

		app.addMethod('api.addEndpoint', this.addEndpoint.bind(this));
		this.routes = [];
	}

	init(next) {
		this.logger.info('Initializing');
		this.app.server.register([{
			register: this.registerToServer
		}], next);
	}

	registerToServer(server, options, next) {
		server.bind({
			app: this.app,
			flux: this.app.flux,
			db: this.app.db
		});

		this.server = server;
		next();
	}

	addEndpoint(endpoint, definition) {
		this.logger.debug({
			method: 'api.addEndpoint',
			endpoint: endpoint
		});

		this.server.route(this.getRoutes(
			definition,
			this.options.apiPrefix.concat('/').concat(endpoint)
		));
	}

	getRoutes(definition, basePath) {
		return definition.endpoints.map(function(route) {
			route.path = basePath.concat(route.path);
			return route;
		});
	}
}

FlemethApi.attributes = {
	name: 'api',
	version: '1.0.0',
	swaggerSpecs: {
		tags: []
	}
};

module.exports = FlemethApi;
