'use strict';
const SnapshotsModel = require('./SnapshotsModel');
const SnapshotsApi = require('./SnapshotsApi');

class SettingsManager {
	constructor(app, options) {
		this.app = app;
		this.logger = app.logger.child({component: 'SnapshotsManager'});
		this.flux = app.methods.flux;
		this.snapshotPeriod = options.snapshotPeriod || 5 * 60 * 1000;

		this.app.addMethod('snapshots.write', this.writeSnapshot.bind(this));
		this.app.addMethod('snapshots.read', this.readSnapshots.bind(this));

		this.app.methods.db.registerModel('Snapshots', SnapshotsModel);
		this.app.methods.api.addEndpoint('snapshots', SnapshotsApi);

		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));
		this.app.addHook('lifecycle.stop', this.onAppStop.bind(this));
	}

	onAppStart(payload, next) {
		this.logger.info('Starting');
		this.collectTaskId =  global.setInterval(this.collectSnapshots.bind(this), this.snapshotPeriod);
		global.setTimeout(next, 0);
	}

	onAppStop(payload, next) {
		this.logger.info('Stopping');
		global.clearInterval(this.collectTaskId);
		global.setTimeout(next, 0);
	}

	collectSnapshots() {
		this.logger.debug('Collecting snapshots');

		this.app.process('snapshots.collect', {
			lastUpdate: Date.now() - this.snapshotPeriod * 3,
			snapshots: []
		}, (error, payload) => {
			if (!error && payload && payload.snapshots && payload.snapshots.length > 0) {
				this.logger.debug('Collected snapshots', payload.snapshots);

				if (payload.snapshots.length === 1) {
					this.writeSnapshot(payload.snapshots[0].type, payload.snapshots[0].data);
				}
				else {
					this.writeSnapshotBatch(payload.snapshots);
				}
			}
		});
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

	writeSnapshotBatch(batch, next) {
		const snapshots = this.app.methods.db.getCollection('Snapshots').forge(batch.map((item) => {
			return Object.assign({
				time: Date.now()
			}, item);
		}));

		return snapshots.invokeThen('save')
			.then((models) => {
				if (next) {
					return next(null, models.map((model) => { return model.toJSON(); }));
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
