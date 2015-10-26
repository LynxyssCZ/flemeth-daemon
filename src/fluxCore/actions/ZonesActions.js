var assign = require('object-assign');

module.exports = {
	updateValues: function(zonesValues) {
		var zones = Object.keys(zonesValues).map(function(zoneId) {
			return {
				id: zoneId,
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
	},
	createZone: function(initialData, callback) {
		var mockId = generateKey();
		var zone = assign({
			id: mockId
		}, initialData);

		var action = {
			type: 'Zones.Create',
			payload: {
				zones: [zone]
			}
		};

		callback(null, zone.id, [action]);
	},
	deleteZone: function(zoneId, callback) {
		var action = {
			type: 'Zones.Delete',
			payload: {
				deletedZones: [zoneId]
			}
		};

		callback(null, action);
	}
};

function mean(array) {
	var sum = 0, i;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return array.length ? sum / array.length : 0;
}


var IntSize = Math.pow(2, 32);

function generateKey() {
	return (Math.random()*IntSize).toString(16);
}
