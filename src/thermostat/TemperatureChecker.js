var TemperatureChecker = function(options) {
	this.logger = options.logger.child({component: 'TemperatureChecker'});
	this.container = options.container;
}; TemperatureChecker.prototype.constructor = TemperatureChecker;
module.exports = TemperatureChecker;


TemperatureChecker.prototype.start = function() {
	this.logger.info('Starting temperature checker');
	this.sensorsSubscriptionKey = this.container.subscribe([
		'Zones'
	], this.update.bind(this));
};

TemperatureChecker.prototype.stop = function() {
	this.logger.info('Stoping temperature checker');
	this.container.unsubscribe(this.sensorsSubscriptionKey);
};

TemperatureChecker.prototype.update = function () {
	var state = this.container.getState(['Zones', 'TempChecker']);
	var zonesMean = this.getZonesMean(state.Zones);

	this.logger.debug(zonesMean);
};

TemperatureChecker.prototype.getZonesMean = function (zones) {
	var data = zones.reduce(function(result, zone) {
		var weight = zone.get('priority');
		var value = zone.get('value');

		if (weight) {
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

	if (data.weightsSum) {
		return (data.valuesSum / data.weightsSum);
	}
	else {
		return null;
	}
};
