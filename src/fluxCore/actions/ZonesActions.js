var assign = require('object-assign');
var Promise = require('bluebird');
var FlemDb = require('../../db');


module.exports = {
	loadFromDB: function() {
		return FlemDb.getCollection('Zones').forge()
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
	update: function(zoneData) {
		var Zone = FlemDb.getModel('Zones');

		var data = {};
		data.id = zoneData.id;

		return [
			{ zones: [ zoneData ] },
			Zone.forge(data)
			.fetch({require: true})
			.then(function(model) {
				return model.save(zoneData);
			})
			.then(function(zone) {
				return { zones: [zone.toJSON()] };
			})
		];
	},
	create: function(initialData) {
		var mockId = generateKey();

		return [
			{
				zones: [assign({ id: mockId }, initialData)]
			},
			FlemDb.getModel('Zones').forge(initialData).save()
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
		var Zone = FlemDb.getModel('Zones');
		zoneIds = Array.isArray(zoneIds) ? zoneIds : [zoneIds];

		var zonePromises = zoneIds.map(function(zoneId) {
			var data = {};
			data.id = zoneId;

			return Zone.forge(data).destroy();
		});

		return [
			{deletedZones: zoneIds},
			Promise.all(zonePromises)
			.then(function() {
				return {deletedZones: zoneIds};
			})
		];
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
