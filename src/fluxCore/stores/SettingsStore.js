'use strict';
const Map = require('immutable').Map;
const actionTag = require('fluxerino').Utils.actionTag;
const RootActions = require('../../RootActions');
const SettingsActions = require('../actions/SettingsActions');

const SettingsStore = {
	'Lifecycle.Init': getDefaultState,
	[actionTag(RootActions.loadFromDB)]: updateSettings,
	[actionTag(SettingsActions.create)]: updateSettings,
	[actionTag(SettingsActions.update)]: updateSettings,
	[actionTag(SettingsActions.delete)]: deleteSettings
};

module.exports = SettingsStore;

function getDefaultState() {
	return Map({
		// Implement default state
	});
}

function deleteSettings(payload, state) {
	payload.deletedSettings.forEach(function(settingId) {
		state = state.delete(settingId);
	});

	return state;
}

function updateSettings(payload, state) {
	const settings = payload.settings;

	if (settings) {
		settings.forEach(function(setting) {
			let newSetting;
			if (state.has(setting.key)) {
				newSetting = state.get(setting.key).merge(Map(setting));
			}
			else {
				newSetting = createSetting(setting);
			}

			state = state.set(newSetting.get('key'), newSetting);
		});
	}

	return state;
}

function createSetting(initialData) {
	return Map({
		key: initialData.key,
		value: initialData.value
	});
}
