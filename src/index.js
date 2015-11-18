var assign = require('object-assign');
var Async = require('async');
var Core = require('./fluxCore');
var Server = require('./server');
var Thermostat = require('./thermostat');
var FlemDb = require('./db');

var Flemeth = function(options) {
	this.logger = options.logger;
	this.createContainer();
	this.dbOptions = options.db;

	this.thermostat = new Thermostat(assign({
		logger: this.logger,
		container: this.container,
		db: FlemDb
	}, options.thermostat));

	this.server = new Server(assign({
		logger: this.logger,
		container: this.container,
		db: FlemDb
	}, options.server));
};
module.exports = Flemeth;

Flemeth.prototype.init = function (next) {
	Async.series([
		this.server.init.bind(this.server),
		this.initDB.bind(this),
		this.loadPersistance.bind(this)
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

Flemeth.prototype.initDB = function (callback) {
	return FlemDb.config(this.dbOptions, callback);
};

Flemeth.prototype.createContainer = function () {
	this.container = new Core({
		logger: this.logger,
		db: FlemDb
	});
};

Flemeth.prototype.loadPersistance = function (next) {
	this.container.push(this.container.actions.Root.loadFromDB, [], function(err) {
		next(err);
	});
};
