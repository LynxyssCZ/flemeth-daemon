var assign = require('object-assign');
var FlemDb = require('../../db');


module.exports = {
	loadFromDB: function() {
		return FlemDb.models.Zones.Collection.forge()
			.fetch()
			.then(function(collection) {
				console.log(collection.toJSON());
			});
	},
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
			FlemDb.models.Zones.Model.forge(initialData).save()
				.then(function(zone) {
					if (zone) {
						return {
							zones: [zone.toJSON()]
						};
					}
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
	return 'loading_' + (Math.random()*IntSize).toString(16);
}
