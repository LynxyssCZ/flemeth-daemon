var Map = require('immutable').Map;

function PlansStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}
	return state;
}

module.exports = PlansStore;

function getDefaultState() {
	return Map({});
}
