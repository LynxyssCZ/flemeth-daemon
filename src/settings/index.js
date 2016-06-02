'use strict';
const Actions = require('./SettingsActions');
const Store = require('./SettingsStore');
const SettingsModel = require('./SettingsModel');
const SettingsApi = require('./SettingsApi');

class SettingsManager {
	constructor(app) {
		this.app = app;
		this.logger = app.logger.child({component: 'SettingsManager'});
		this.flux = app.methods.flux;

		this.app.addMethod('settings.set', this.setSetting.bind(this));
		this.app.addMethod('settings.remove', this.removeSetting.bind(this));

		this.app.methods.flux.addStore('Settings', Store);
		this.app.methods.db.registerModel('Setting', SettingsModel);
		this.app.methods.persistence.add('Setting', 'settings');
		this.app.methods.api.addEndpoint('settings', SettingsApi);
	}

	// Api methods
	setSetting(setting, next) {
		this.flux.push(Actions.update, [setting], next);
	}

	removeSetting(settingKey, next) {
		this.flux.push(Actions.delete, [settingKey], next);
	}
}

module.exports = SettingsManager;
