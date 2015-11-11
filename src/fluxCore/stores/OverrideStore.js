var Map = require('immutable').Map;
var OverrideActions = require('../actions').Override;

function OverrideStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	switch (type) {
		case OverrideActions.create.actionType:
			state = createOverride(payload.override);
			break;
		case OverrideActions.update.actionType:
			state = createOverride(payload.override, state);
			break;
		case OverrideActions.delete.actionType:
			state = getDefaultState();
			break;
	}

	return state;
}
module.exports = OverrideStore;

function getDefaultState() {
	return false;
}

function createOverride(data, state) {
	return Map({
		reason: data.reason,
		value: data.value,
		length: data.length,
		created: state ? state.get('created') : Date.now()
	});
}
