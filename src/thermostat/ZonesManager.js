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
		global: {
			values: [],
			times: []
		}
	};

	state.Sensors.forEach(function(sensor) {
		var targetZone = sensorsMap[sensor.get('id')];
		if (targetZone && !zonesValues[targetZone]) {
			zonesValues[targetZone] = {
				values: [],
				times: []
			};
		}

		if (targetZone) {
			zonesValues[targetZone].values.push(sensor.get('average'));
			zonesValues[targetZone].times.push(sensor.get('lastUpdate'));
		}

		zonesValues.global.values.push(sensor.get('average'));
		zonesValues.global.times.push(sensor.get('lastUpdate'));
	});

	this.container.push(this.container.actions.Zones.update, [zonesValues]);
};
