var Hapi = require('hapi');
var assign = require('object-assign');


var Server = function(options) {
	this.logger = options.logger.child({component: 'Server'});
	this.container = options.container;
	this.actions = options.actions;

	this.server = new Hapi.Server(assign({
		app: {
			container: options.container,
			actions: options.actions
		}
	},options.serverConfig));
	this.server.connection(options.connection);

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
			register: require('hapi-swagger'),
			options: {
				apiVersion: '0.1.0',
				documentationPath: '/swag-doc',
				endpoint: '/swag-spec',
				info: {
					title: 'Flemeth daemon',
					description: 'Javascript based home thermostat'
				}
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
