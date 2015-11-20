module.exports = {
	read: function(fromTs, toTs, zones) {
		var temps = this.db.getCollection('ZonesTemps').forge()
			.query('whereBetween', 'time', [fromTs, toTs]);

		if (zones) {
			temps.query('whereIn', 'zone_id', zones);
		}

		return temps.fetch()
			.then(function(collection) {
				return {
					zonesTemps: collection.toJSON()
				};
			});
	},
	write: function(zoneId, temp, time) {
		return this.db.getModel('ZonesTemps').forge({
			zoneId: zoneId,
			temp: temp,
			time: time
		}).then(function(value) {
			if (value) {
				return {
					zonesTemps: [ value.toJSON() ]
				};
			}
		});
	},
	writeBatch: function(data) {
		var temps = this.db.getCollection('ZonesTemps').forge(data);

		return temps.invokeThen('save')
			.then(function(models) {
				return {
					zonesTemps: [ models.map(function(model) { return model.toJSON(); }) ]
				};
			});
	}
};
