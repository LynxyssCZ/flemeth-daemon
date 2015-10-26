var assign = require('object-assign');
var Async = require('async');
var core = require('./fluxCore');
var Container = core.Container;
var Store = core.stores.compose(core.stores.stores);
var Server = require('./server');
var Thermostat = require('./thermostat');
var FlemDb = require('./db');

var Flemeth = function(options) {
	this.logger = options.logger;

	this.db = new FlemDb(assign({
		logger: this.logger
	}, options.db));

	this.createContainer();

	this.container.dispatch({
		type: 'Mock.zone',
		payload: {
			zones: {
				id: 'zone-chan',
				sensors: ['DRF5150-225-4'],
				name: 'Mocked zone'
			}
		}
	});

	this.thermostat = new Thermostat(assign({
		logger: this.logger,
		container: this.container,
		actions: core.actions
	}, options.thermostat));

	this.server = new Server(assign({
		logger: this.logger,
		container: this.container,
		actions: core.actions
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
	var initial = {};

	this.container = new Container(Store);
	this.container.dispatch(initial); // First dispatch to init stores
};
