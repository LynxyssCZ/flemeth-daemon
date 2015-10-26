var ZonesManager = function(options) {
	this.logger = options.logger.child({component: 'ZonesManager'});
	this.container = options.container;
	this.actions = options.actions;
}; ZonesManager.prototype.constructor = ZonesManager;
module.exports = ZonesManager;


ZonesManager.prototype.start = function() {
	this.logger.info('Starting zones manager');
	this.sensorsSubscriptionKey = this.container.subscribe([
		'Sensors'
	], this.updateZonesValues.bind(this));
};

ZonesManager.prototype.stop = function() {
	this.logger.info('Stoping zones manager');
	this.container.unsubscribe(this.sensorsSubscriptionKey);
};

ZonesManager.prototype.generateSensorsMap = function (zones) {
	var sensorsMap = {};

	zones.forEach(function(zone) {
		var zonesSensors = zone.get('sensors');
		var zoneId = zone.get('id');

		if (!zonesSensors) {
			return;
		}

		for (var i = 0; i < zonesSensors.length; i++) {
			sensorsMap[zonesSensors[i]] = zoneId;
		}
	});

	return sensorsMap;
};

ZonesManager.prototype.updateZonesValues = function () {
	var state = this.container.getState(['Zones', 'Sensors']);
	var sensorsMap = this.generateSensorsMap(state.Zones);
	var zonesValues = {
		default: []
	};

	this.logger.debug(sensorsMap);

	state.Sensors.forEach(function(sensor) {
		var targetZone = sensorsMap[sensor.get('id')];
		console.log(targetZone);
		if (!targetZone) {
			zonesValues.default.push(sensor.get('average'));
		}
		else if (!zonesValues[targetZone]) {
			zonesValues[targetZone] = [sensor.get('average')];
		}
		else {
			zonesValues[targetZone].push(sensor.get('average'));
		}
	});

	this.logger.info(zonesValues);
};

function mean(array) {
	var sum = 0, i;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return array.length ? sum / array.length : 0;
}
