module.exports = {
	updateValues: function(zonesValues) {
		var zones = Object.keys(zonesValues).map(function(zones, zoneId) {
			return {
				value: mean(zonesValues[zoneId].values),
				lastUpdate: Math.max.apply(null, zonesValues[zoneId].times)
			};
		});

		return [{
			type: 'Zones.ReadValues',
			payload: {
				zones: zones
			}
		}];
	}
};

function mean(array) {
	var sum = 0, i;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return array.length ? sum / array.length : 0;
}
