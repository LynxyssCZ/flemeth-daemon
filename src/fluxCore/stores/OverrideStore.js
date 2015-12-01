var Map = require('immutable').Map;
var OverrideActions = require('../actions').Override;

function OverrideStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	switch (type) {
		case OverrideActions.create.actionType:
		case OverrideActions.update.actionType:
			state = update(payload.override, state);
			break;
		case OverrideActions.delete.actionType:
			state = getDefaultState();
			break;
	}

	return state;
}
module.exports = OverrideStore;

function getDefaultState() {
	return Map({
		reason: null,
		value: null,
		length: null,
		created: null
	});
}

function update(data, state) {
	return state.merge(data);
}
