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
	var state = this.container.getSlice(['Zones', 'Sensors', 'TempChecker']);

	var now = Date.now();
	var prevUpdate = (now - this.updatePeriod * 5);

	var batch = [
		{
			type: 'zones_temps',
			data: this.processZones(state.Zones, prevUpdate),
			time: now
		},
		{
			type: 'sensors_values',
			data: this.processSensors(state.Sensors, prevUpdate),
			time: now
		},
		{
			type: 'temp_checker',
			data: this.processTempChecker(state.TempChecker, state.Zones, prevUpdate),
			time: now
		}
	];

	this.container.push(this.container.actions.Snapshots.writeBatch, [batch]);
};

SnapshotsManager.prototype.processZones = function (zones, prevUpdate) {
	return zones.filter(function(zone) {
		return zone.get('lastUpdate') > prevUpdate;
	}).map(function(zone) {
		return {
			zoneId: zone.get('id'),
			temp: zone.get('value')
		};
	}).toArray();
};

SnapshotsManager.prototype.processSensors = function (sensors, prevUpdate) {
	return sensors.filter(function(sensor) {
		return sensor.get('lastUpdate') > prevUpdate;
	}).map(function(sensor) {
		return {
			sensorId: sensor.get('id'),
			value: sensor.get('average'),
			meta: sensor.get('meta')
		};
	}).toArray();
};

SnapshotsManager.prototype.processTempChecker = function (tempChecker, zones) {
	var data = zones.reduce(function(result, zone) {
		var weight = zone.get('priority');
		var value = zone.get('value');

		if (weight && value) {
			result = {
				valuesSum: result.valuesSum + (weight * value),
				weightsSum: result.weightsSum + weight
			};
		}

		return result;
	}, {
		valuesSum: 0,
		weightsSum: 0
	});

	return {
		temp: data.weightsSum ? (data.valuesSum / data.weightsSum) : null,
		state: tempChecker.get('state'),
		target: tempChecker.get('target'),
		hysteresis: tempChecker.get('hysteresis'),
		state: tempChecker.get('state')
	};
};
