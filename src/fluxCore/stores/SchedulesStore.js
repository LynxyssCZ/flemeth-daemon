var Map = require('immutable').Map;

function SchedulesStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}
	return state;
}

module.exports = SchedulesStore;

function getDefaultState() {
	return Map({});
}
