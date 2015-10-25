var Hapi = require('hapi');


var Server = function(options) {
	this.logger = options.logger.child({component: 'Server'});
	this.server = new Hapi.Server(options.serverConfig);
	this.server.connection(options.connection);

	this.apiOptions = options.api;
};
module.exports = Server;

Server.prototype.init = function (next) {
	this.server.register([
		{
			register: require('./api'),
			options: this.apiOptions
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
