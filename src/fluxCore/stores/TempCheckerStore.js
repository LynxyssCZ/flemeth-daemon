var Map = require('immutable').Map;

function TempcheckerStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	return state;
}

module.exports = TempcheckerStore;

function getDefaultState() {
	return Map({});
}
