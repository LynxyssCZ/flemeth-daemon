var assign = require('object-assign');

module.exports = {
	update: function(zonesValues) {
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
		var zone = assign({
			id: mockId
		}, initialData);

		return {
			zones: [zone]
		};
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
