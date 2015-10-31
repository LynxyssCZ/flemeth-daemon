var assign = require('object-assign');
var Async = require('async');
var Core = require('./fluxCore');
var Server = require('./server');
var Thermostat = require('./thermostat');
var FlemDb = require('./db');

var Flemeth = function(options) {
	this.logger = options.logger;
	this.createContainer();

	FlemDb.config(assign({
		logger: this.logger
	}, options.db));

	this.thermostat = new Thermostat(assign({
		logger: this.logger,
		container: this.container,
		db: FlemDb.db
	}, options.thermostat));

	this.server = new Server(assign({
		logger: this.logger,
		container: this.container,
		db: FlemDb.db
	}, options.server));
};
module.exports = Flemeth;

Flemeth.prototype.init = function (next) {
	Async.series([
		this.server.init.bind(this.server)
	], function(err) {
		next(err);
	});
};

Flemeth.prototype.start = function (next) {
	this.logger.info('Flemeth daemon starting');
	Async.series([
		this.thermostat.start.bind(this.thermostat),
		this.server.start.bind(this.server)
	], function(err) {
		next(err);
	});
};

Flemeth.prototype.stop = function (next) {
	this.logger.info('Flemeth daemon stoping.');
	Async.series([
		this.thermostat.stop.bind(this.thermostat),
		this.server.stop.bind(this.server)
	], function(err) {
		next(err);
	});
};

// TODO: Load initial data from database
Flemeth.prototype.createContainer = function () {
	this.container = new Core();
};
