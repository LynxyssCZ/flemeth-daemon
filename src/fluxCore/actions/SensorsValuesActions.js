module.exports = {
	read: function(fromTs, toTs, sensors) {
		var values = this.db.getCollection('SensorsValues').forge()
			.query('whereBetween', 'time', [fromTs, toTs]);

		if (sensors) {
			values.query('whereIn', 'sensor_id', sensors);
		}

		return values.fetch()
			.then(function(collection) {
				return {
					sensorsValues: collection.toJSON()
				};
			});
	},
	write: function(sensorId, value, time, meta) {
		return this.db.getModel('SensorsValues').forge({
			sensorId: sensorId,
			value: value,
			time: time,
			meta: meta
		}).then(function(value) {
			if (value) {
				return {
					sensorsValues: [ value.toJSON() ]
				};
			}
		});
	},
	writeBatch: function(data) {
		var temps = this.db.getCollection('SensorsValues').forge(data);

		return temps.invokeThen('save')
			.then(function(models) {
				return {
					sensorsValues: [ models.map(function(model) { return model.toJSON(); }) ]
				};
			});
	}
};
