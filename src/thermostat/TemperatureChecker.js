var TemperatureChecker = function(options) {
	this.logger = options.logger.child({component: 'TemperatureChecker'});
	this.container = options.container;
}; TemperatureChecker.prototype.constructor = TemperatureChecker;
module.exports = TemperatureChecker;


TemperatureChecker.prototype.start = function(next) {
	this.logger.info('Starting temperature checker');
	this.sensorsSubscriptionKey = this.container.subscribe([
		'Zones'
	], this.update.bind(this));

	next();
};

TemperatureChecker.prototype.stop = function() {
	this.logger.info('Stoping temperature checker');
	this.container.unsubscribe(this.sensorsSubscriptionKey);
};

TemperatureChecker.prototype.update = function () {
	var state = this.container.getState(['Zones', 'TempChecker']);
	var zonesMean = this.getZonesMean(state.Zones);
	var target = state.TempChecker.get('target');
	var hysteresis = state.TempChecker.get('hysteresis');
	var hysteresisState = state.TempChecker.get('rising');

	if (!target || !zonesMean) {
		return;
	}

	zonesMean = Number(zonesMean.toFixed(3));
	target = Number(target.toFixed(3));

	if (hysteresisState === true && zonesMean > (target + hysteresis)) {
		return this.container.push(this.container.actions.TempChecker.updateState, [{
			rising: false,
			state: true
		}]);
	}
	else if (hysteresisState === false && zonesMean < (target - hysteresis)) {
		return this.container.push(this.container.actions.TempChecker.updateState, [{
			rising: true,
			state: false
		}]);
	}
};

TemperatureChecker.prototype.getZonesMean = function (zones) {
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

	if (data.weightsSum) {
		return (data.valuesSum / data.weightsSum);
	}
	else {
		return null;
	}
};
