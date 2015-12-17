'use strict';
var SnapshotsManager = function(options) {
	this.logger = options.logger.child({ component: 'SnapshotsManager' });
	this.container = options.container;

	this.updatePeriod = options.updatePeriod;
	this.updateTaskId = null;
}; SnapshotsManager.prototype.constructor = SnapshotsManager;

module.exports = SnapshotsManager;

SnapshotsManager.prototype.start = function (next) {
	var self = this;
	this.logger.info('Starting snapshots manager');

	this.updateTaskId = global.setInterval(function() {
		self.update();
	}, this.updatePeriod);

	global.setImmediate(next);
	// self.update();
};

SnapshotsManager.prototype.stop = function (next) {
	this.logger.info('Stopping snapshots manager');
	global.clearInterval(this.updateTaskId);

	global.setImmediate(next);
};

SnapshotsManager.prototype.update = function() {
	var state = this.container.getState(['Zones', 'Sensors']);

	var now = Date.now();
	var prevUpdate = (now - this.updatePeriod * 5);

	var zonesData = state.Zones.filter(function(zone) {
		return zone.get('lastUpdate') > prevUpdate;
	}).map(function(zone) {
		return {
			zoneId: zone.get('id'),
			temp: zone.get('value')
		};
	}).toArray();

	var sensorsData = state.Sensors.filter(function(sensor) {
		return sensor.get('lastUpdate') > prevUpdate;
	}).map(function(sensor) {
		return {
			sensorId: sensor.get('id'),
			value: sensor.get('average'),
			meta: sensor.get('meta')
		};
	}).toArray();

	var batch = [
		{
			type: 'zones_temps',
			data: zonesData,
			time: now
		},
		{
			type: 'sensors_values',
			data: sensorsData,
			time: now
		}
	];

	this.container.push(this.container.actions.Snapshots.writeBatch, [batch]);
};
