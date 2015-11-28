var Map = require('immutable').Map;
var OverrideActions = require('../actions').Override;

function OverrideStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	switch (type) {
		case OverrideActions.create.actionType:
			state = create(payload.override, state);
			break;
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
	return false;
}

function create(data) {
	return Map(data);
}

function update(data, state) {
	return state.merge(data);
}
