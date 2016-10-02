'use strict';
const SnapshotsModel = require('./SnapshotsModel');
const SnapshotsApi = require('./SnapshotsApi');

class SettingsManager {
	constructor(app) {
		this.app = app;
		this.logger = app.logger.child({component: 'SnapshotsManager'});
		this.flux = app.methods.flux;

		this.app.addMethod('snapshots.write', this.writeSnapshot.bind(this));
		this.app.addMethod('snapshots.read', this.readSnapshots.bind(this));

		this.app.methods.db.registerModel('Snapshots', SnapshotsModel);
		this.app.methods.api.addEndpoint('snapshots', SnapshotsApi);
	}

	// Api methods
	writeSnapshot(type, data, next) {
		const snapshot = this.app.methods.db.getModel('Snapshots').forge({
			type: type,
			data: data,
			time: Date.now()
		});

		return snapshot.save()
			.then((model) => {
				if (next) {
					return next(null, model.toJSON());
				}
			})
			.catch((err) => {
				if (next) {
					return next(err);
				}
			});
	}

	readSnapshots(fromTs, toTs, types, next) {
		if (!next) {
			return;
		}

		const query =  this.app.methods.db.getCollection('Snapshots').forge()
			.query('whereBetween', 'time', [fromTs, toTs]);

		if (types) {
			query.query('whereIn', 'type', types);
		}

		return query.fetch()
			.then(function(collection) {
				return next(null, {
					snapshots: collection.toJSON()
				});
			});
	}
}

module.exports = SettingsManager;
