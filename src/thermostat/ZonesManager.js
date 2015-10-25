var ZonesManager = function(options) {
	this.logger = options.logger.child({component: 'ZonesManager'});
	this.container = options.container;
	this.actions = options.actions;
}; ZonesManager.prototype.constructor = ZonesManager;
module.exports = ZonesManager;


ZonesManager.prototype.start = function() {
	this.logger.info('Starting zones manager');
	this.subscriptionKey = this.container.subscribe([
		'Sensors'
	], this.updateZonesValues.bind(this));
};

ZonesManager.prototype.stop = function() {
	this.logger.info('Stoping zones manager');
	this.container.unsubscribe(this.subscriptionKey);
};

ZonesManager.prototype.updateZonesValues = function () {
	var state = this.container.getState(['Zones', 'Sensors']);
	var zones = state.Zones.toArray();
	var sensors = state.Sensors.toArray();

	var zonesValues = sensors.filter(function(sensor) {
		return sensor.get('type') !== 'temp';
	}).reduce(function(zonesValues, sensor) {
		var associated;
		var id = sensor.get('id');

		for (var i = 0; i < zones.length; i++) {
			var zone = zones[i];
			var zoneSensors = zone.get('sensors');

			if (zoneSensors && zoneSensors.indexOf(id) >= 0) {
				storeZoneValue(zonesValues[zone.get('id')], sensor);
				associated = true;
				break;
			}
		}

		if (!associated) {
			zonesValues.default = storeZoneValue(zonesValues.default, sensor);
		}

		return zonesValues;
	}, { default: [] });

	this.logger.info(zonesValues);
};

function storeZoneValue(zonesValues, sensor) {
	if (zonesValues) {
		zonesValues.push(sensor.get('average'));
	}
	else {
		zonesValues = [sensor.get('average')];
	}

	return zonesValues;
}

function mean(array) {
	var sum = 0, i;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return array.length ? sum / array.length : 0;
}
