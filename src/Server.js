'use strict';
var Hapi = require('hapi');

class Server {
	constructor(app, options) {
		this.logger = app.logger.child({component: 'Server'});
		this.app = app;

		this.server = new Hapi.Server(options.serverConfig);
		this.server.connection(options.connection);

		this.app.addMethod('server.register', this.register.bind(this));
		this.app.addHook('core.startInternals', this.onAppStart.bind(this));
		this.app.addHook('lifecycle.stop', this.onAppStop.bind(this));
	}

	init(next) {
		this.server.register({
			register: require('hapi-bunyan'),
			options: {
				logger: this.logger
			}
		}, next);
	}

	onAppStart(payload, next) {
		this.logger.info('Starting');
		this.server.start(function (err) {
			next(err);
		});
	}

	onAppStop(payload, next) {
		this.logger.info('Stoping');
		this.server.stop(function(err) {
			next(err);
		});
	}

	register(plugins, next) {
		this.server.register(plugins, next);
	}
}

module.exports = Server;

//
// var Server = function(options) {
// 	this.logger = options.logger.child({component: 'Server'});
//
// 	this.server = new Hapi.Server(options.serverConfig);
// 	this.server.connection(options.connection);
// };
// Server.prototype.init = function (next) {
// 	this.server.register([
// 		{
// 			register: require('./api'),
// 			options: assign({
// 				base: '/api'
// 			}, this.apiOptions)
// 		}, {
// 			register: require('hapi-bunyan'),
// 			options: {
// 				logger: this.logger
// 			}
// 		},
// 		require('vision'),
// 		require('inert'),
// 		{
// 			register: require('hapi-swaggered'),
// 			options: {
// 				endpoint: '/swag-spec',
// 				stripPrefix: '/api',
// 				tags: require('./api').register.attributes.swaggerSpecs.tags,
// 				info: {
// 					title: 'Flemeth daemon',
// 					description: 'Javascript based home thermostat',
// 					version: require('./api').register.attributes.version
// 				}
// 			}
// 		},
// 		{
// 			register: require('hapi-swaggered-ui'),
// 			options: {
// 				title: 'Flemeth API Documentation',
// 				path: '/swag-doc',
// 				swaggerOptions: {
// 					validatorUrl: null
// 				},
// 				authorization: false
// 			}
// 		},
// 		{
// 			register: require('flemeth-web'),
// 			options: {
// 				base: ''
// 			}
// 		}
// 	], function(err) {
// 		next(err);
// 	});
// };
//
// Server.prototype.start = function (next) {
// 	this.logger.info('Server starting');
// 	this.server.start(function (err) {
// 		next(err);
// 	});
// };
//
// Server.prototype.stop = function (next) {
// 	this.logger.info('Server stoping');
// 	this.server.stop(function(err) {
// 		next(err);
// 	});
// };
