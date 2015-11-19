var Map = require('immutable').Map;
var TempCheckerActions = require('../actions').TempChecker;

function TempCheckerStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	switch (type) {
		case TempCheckerActions.changeTarget.actionType:
			state = updateTarget(payload.tempChecker, state);
			break;
		case TempCheckerActions.updateState.actionType:
			state = updateState(payload.tempChecker, state);
			break;
	}

	return state;
}

module.exports = TempCheckerStore;

function getDefaultState() {
	return Map({
		target: null,
		hysteresis: null,
		rising: false,
		state: true
	});
}


function updateState(newState, state) {
	if (typeof newState.rising !== 'undefined') {
		state = state.set('rising', newState.rising);
	}

	if (typeof newState.state !== 'undefined') {
		state = state.set('state', newState.state);
	}

	return state;
}

function updateTarget(newTarget, state) {
	if (typeof newTarget.target !== 'undefined') {
		state = state.set('target', newTarget.target);
	}

	if (typeof newTarget.hysteresis !== 'undefined') {
		state = state.set('hysteresis', newTarget.hysteresis);
	}

	return state;
}
