var assign = require('object-assign');
var Promise = require('bluebird');


module.exports = {
	updateValues: function(zonesValues) {

		var zones = zonesValues.map(function(zone) {
			return {
				id: zone.id,
				value: zone.value,
				lastUpdate: zone.lastUpdate
			};
		});

		return {
			zones: zones
		};
	},
	update: function(zoneData) {
		var Zone = this.db.getModel('Zones');

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
			this.db.getModel('Zones').forge(initialData).save()
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
		var Zone = this.db.getModel('Zones');
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

function generateKey() {
	return 'loading_' + (Math.random()*IntSize).toString(16);
}
