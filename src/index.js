var assign = require('object-assign');
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

Flemeth.prototype.start = function () {
	this.logger.info('Flemeth daemon starting');
	this.thermostat.start();
};

Flemeth.prototype.stop = function () {
	this.logger.info('Flemeth daemon stoping.');
	this.thermostat.stop();
};

// TODO: Load initial data from database
Flemeth.prototype.createContainer = function () {
	var initial = {};

	this.container = new Container(Store);
	this.container.dispatch(initial); // First dispatch to init stores
};
