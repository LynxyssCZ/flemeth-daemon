'use strict';
const RootActions = require('./RootActions');

class PersistenceManager {
	constructor(app) {
		this.app = app;
		this.logger = app.logger.child({component: 'SettingsManager'});
		this.flux = app.methods.flux;

		this.app.addMethod('persistence.add', this.addPersistence.bind(this));
		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));

		this.persistentModels = [];
	}

	addPersistence(modelName, storeKey, isModel) {
		this.persistentModels.push({
			modelName: modelName,
			key: storeKey,
			isModel: isModel
		});
	}

	onAppStart(payload, next) {
		if (this.persistentModels.length) {
			this.flux.push(RootActions.loadFromDB, [this.persistentModels], next);
		}
		else {
			next();
		}
	}
}

module.exports = PersistenceManager;
