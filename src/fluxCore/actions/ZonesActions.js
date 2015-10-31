var assign = require('object-assign');
var FlemDb = require('../../db').db;


module.exports = {
	updateValues: function(zonesValues) {
		var zones = Object.keys(zonesValues).map(function(zoneId) {
			return {
				id: zoneId,
				value: mean(zonesValues[zoneId].values),
				lastUpdate: Math.max.apply(null, zonesValues[zoneId].times)
			};
		});

		return {
			zones: zones
		};
	},
	create: function(initialData) {
		var mockId = generateKey();

		return [
			{
				zones: [assign({ id: mockId }, initialData)]
			},
			FlemDb.zones.insertAsync(initialData)
				.then(function(data) {
					return {
						zones: [{
							id: data._id,
							name: data.name,
							sensors: data.sensors,
							priority: data.priority
						}]
					};
				})
		];
	},
	delete: function(zoneIds) {
		zoneIds = Array.isArray(zoneIds) ? zoneIds : [zoneIds];

		return {
			deletedZones: zoneIds
		};
	}
};

var IntSize = Math.pow(2, 32);

function mean(array) {
	var sum = 0, i;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return array.length ? sum / array.length : 0;
}

function generateKey() {
	return (Math.random()*IntSize).toString(16);
}
