var Map = require('immutable').Map;
var RootActions = require('../actions').Root;
var SettingsActions = require('../actions').Settings;

function SettingsStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	switch (type) {
		case RootActions.loadFromDB.actionType:
		case SettingsActions.create.actionType:
		case SettingsActions.update.actionType:
			state = updateSettings(payload.settings, state);
			break;
		case SettingsActions.delete.actionType:
			state = deleteSettings(payload.deletedSettings, state);
			break;
	}

	return state;
}

module.exports = SettingsStore;

function getDefaultState() {
	return Map({
		// Implement default state
	});
}

function deleteSettings(ids, state) {
	ids.forEach(function(settingId) {
		state = state.delete(settingId);
	});

	return state;
}

function updateSettings(settings, state) {
	if (settings) {
		settings.forEach(function(setting) {
			var newSetting;
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
