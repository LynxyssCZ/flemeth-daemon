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

	next();
	self.update();
};

SnapshotsManager.prototype.stop = function (next) {
	this.logger.info('Stopping snapshots manager');
	global.clearInterval(this.updateTaskId);

	next();
};

SnapshotsManager.prototype.update = function() {
	var state = this.container.getState(['Zones', 'Sensors']);

	var now = Date.now();
	var zonesData = state.Zones.filter(function(zone) {
		return zone.get('id') !== 'global' && zone.get('value') > 0;
	}).map(function(zone) {
		return {
			zoneId: zone.get('id'),
			temp: zone.get('value'),
			time: now
		};
	}).toArray();

	var sensorsData = state.Sensors.map(function(sensor) {
		return {
			sensorId: sensor.get('id'),
			value: sensor.get('average'),
			meta: sensor.get('meta'),
			time: now
		};
	}).toArray();

	this.container.push(this.container.actions.ZonesTemps.writeBatch, [zonesData]);
	this.container.push(this.container.actions.SensorsValues.writeBatch, [sensorsData]);
};
