var Hapi = require('hapi');
var assign = require('object-assign');


var Server = function(options) {
	this.logger = options.logger.child({component: 'Server'});
	this.container = options.container;

	this.server = new Hapi.Server(options.serverConfig);
	this.server.connection(options.connection);
	this.server.app.container = options.container;
	this.server.app.db = options.db;

	this.apiOptions = options.api;
};
module.exports = Server;

Server.prototype.init = function (next) {
	this.server.register([
		{
			register: require('./api'),
			options: assign({
				base: '/api'
			}, this.apiOptions)
		}, {
			register: require('hapi-bunyan'),
			options: {
				logger: this.logger
			}
		},
		require('vision'),
		require('inert'),
		{
			register: require('hapi-swaggered'),
			options: {
				endpoint: '/swag-spec',
				stripPrefix: '/api',
				tags: require('./api').register.attributes.swaggerSpecs.tags,
				info: {
					title: 'Flemeth daemon',
					description: 'Javascript based home thermostat',
					version: require('./api').register.attributes.version
				}
			}
		},
		{
			register: require('hapi-swaggered-ui'),
			options: {
				title: 'Flemeth API Documentation',
				path: '/swag-doc',
				swaggerOptions: {
					validatorUrl: null
				},
				authorization: false
			}
		},
		{
			register: require('flemeth-web'),
			options: {
				base: ''
			}
		}
	], function(err) {
		next(err);
	});
};

Server.prototype.start = function (next) {
	this.logger.info('Server starting');
	this.server.start(function (err) {
		next(err);
	});
};

Server.prototype.stop = function (next) {
	this.logger.info('Server stoping');
	this.server.stop(function(err) {
		next(err);
	});
};
