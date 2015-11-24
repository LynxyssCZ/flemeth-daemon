var ZonesManager = function(options) {
	this.logger = options.logger.child({component: 'ZonesManager'});
	this.container = options.container;
	this.actions = options.actions;
}; ZonesManager.prototype.constructor = ZonesManager;
module.exports = ZonesManager;


ZonesManager.prototype.start = function(next) {
	this.logger.info('Starting zones manager');
	this.sensorsSubscriptionKey = this.container.subscribe([
		'Sensors'
	], this.updateZonesValues.bind(this));

	next();
};

ZonesManager.prototype.stop = function(next) {
	this.logger.info('Stoping zones manager');
	this.container.unsubscribe(this.sensorsSubscriptionKey);

	next();
};

ZonesManager.prototype.updateZonesValues = function () {
	var state = this.container.getState(['Zones', 'Sensors']);

	var zonesValues = state.Zones.map(function(zone) {
		var sensorsValue = this.getSensorsValue(zone.get('id') === 'global' ? '*' : zone.get('sensors'), state.Sensors);

		return {
			id: zone.get('id'),
			lastUpdate: zone.get('lastUpdate') >= sensorsValue.lastUpdate ? null : sensorsValue.lastUpdate,
			value: sensorsValue.value
		};
	}, this).filter(function(zoneUpdate) {
		return zoneUpdate.lastUpdate > 0;
	}, this).toArray();

	if (zonesValues.length) {
		this.container.push(this.container.actions.Zones.updateValues, [zonesValues]);
	}

};

ZonesManager.prototype.getSensorsValue = function (ids, sensors) {
	var validIds = [];

	if (ids && Array.isArray(ids)) {
		validIds = ids.filter(function(sensorId) {
			return sensors.has(sensorId);
		});
	}
	else if (ids === '*') {
		validIds = sensors.keySeq().toArray();
	}

	var temp = validIds.reduce(function(reduction, sensorId) {
		var sensor = sensors.get(sensorId);
		reduction[0].push(sensor.get('average'));
		reduction[1].push(sensor.get('lastUpdate'));
		return reduction;
	}, [[], []]);

	return {
		lastUpdate: Math.max.apply(Math, temp[1]),
		value: mean(temp[0])
	};
};

function mean(array) {
	var sum = 0, i;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return array.length ? sum / array.length : 0;
}
