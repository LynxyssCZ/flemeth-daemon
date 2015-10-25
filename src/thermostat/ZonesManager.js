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
	var sensors = [];

	state.Sensors.forEach(function(sensor) {
		sensor.push({
			id: sensor.get('sensorId'),
			value: mean(sensor.get('values'))
		});
	});

	this.logger.info(sensors);
};

function mean(array) {
	var sum = 0, i;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return array.length ? sum / array.length : 0;
}
