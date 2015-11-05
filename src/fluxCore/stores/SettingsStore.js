var Map = require('immutable').Map;

function SettingsStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}
	return state;
}

module.exports = SettingsStore;

function getDefaultState() {
	return Map({});
}
