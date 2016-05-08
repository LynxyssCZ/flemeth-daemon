'use strict';

module.exports = {
	updateValues: function updateZonesValues(zonesValues) {
		const zones = zonesValues.map(function(zone) {
			return {
				id: zone.id,
				value: zone.value,
				lastUpdate: zone.lastUpdate
			};
		});

		return { zones: zones };
	},
	update: function* updateZoneData(zoneData) {
		yield { zones: [ zoneData ] };

		yield this.db.getModel('Zones').forge({ id: zoneData.id })
			.fetch({require: true})
			.then(function(model) { return model.save(zoneData); })
			.then(function(zone) {
				return { zones: [zone.toJSON()] };
			});
	},
	create: function* createNewZone(initialData) {
		yield { zones: [Object.assign({ id: generateKey() }, initialData)] };

		yield this.db.getModel('Zones')
			.forge(initialData).save()
			.then(function(zone) {
				if (zone) {
					return { zones: [zone.toJSON()] };
				}
			});
	},
	delete: function* removeZone(zoneId) {
		yield { deletedZones: [zoneId] };

		yield this.db.getModel('Zones')
			.forge({ id: zoneId })
			.destroy()
			.then(function() {
				return { deletedZones: [zoneId] };
			});
	}
};

var IntSize = Math.pow(2, 32);

function generateKey() {
	return 'loading_' + (Math.random()*IntSize).toString(16);
}
