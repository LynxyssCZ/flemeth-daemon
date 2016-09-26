'use strict';

module.exports = {
	updateValues(zonesValues) {
		const zones = zonesValues.map(function(zone) {
			return {
				id: zone.id,
				value: zone.value,
				lastUpdate: zone.lastUpdate
			};
		});

		return { zones: zones };
	},
	updateMean(temperature, zonesCount) {
		// return {}
		return {
			temperature: temperature,
			zonesCount: zonesCount
		};
	},
	* update(zoneData) {
		yield { zones: [ zoneData ] };

		yield this.app.methods.db.getModel('Zones').forge({ id: zoneData.id })
			.fetch({require: true})
			.then(function(model) { return model.save(zoneData); })
			.then(function(zone) {
				return { zones: [zone.toJSON()] };
			});
	},
	* create(initialData) {
		yield { zones: [Object.assign({ id: generateKey() }, initialData)] };

		yield this.app.methods.db.getModel('Zones')
			.forge(initialData).save()
			.then(function(zone) {
				if (zone) {
					return { zones: [zone.toJSON()] };
				}
			});
	},
	* delete(zoneId) {
		yield { deletedZones: [zoneId] };

		yield this.app.methods.db.getModel('Zones')
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
