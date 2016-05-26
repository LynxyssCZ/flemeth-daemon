module.exports = {
	read: function readSnaphots(fromTs, toTs, types) {
		var temps = this.db.getCollection('Snapshots').forge()
			.query('whereBetween', 'time', [fromTs, toTs]);

		if (types) {
			temps.query('whereIn', 'type', types);
		}

		return temps.fetch()
			.then(function(collection) {
				return {
					snapshots: collection.toJSON()
				};
			});
	},
	write: function writeSnapshots(type, data, time) {
		return this.db.getModel('Snapshots').forge({
			type: type,
			data: data,
			time: time
		}).then(function(model) {
			if (model) {
				return {
					snapshots: [ model.toJSON() ]
				};
			}
		});
	},
	writeBatch: function writeSnapsotsBatch(data) {
		var snapshots = this.db.getCollection('Snapshots').forge(data);

		return snapshots.invokeThen('save')
			.then(function(models) {
				return {
					snapshots: [ models.map(function(model) { return model.toJSON(); }) ]
				};
			})
			.catch(function(err) {
				console.log(err);
			});
	}
};
