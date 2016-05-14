'use strict';
const Map = require('immutable').Map;
const actionTag = require('fluxerino').Utils.actionTag;
const TempCheckerActions = require('../actions/TempCheckerActions');

const TempCheckerStore = {
	'Lifecycle.Init': getDefaultState,
	[actionTag(TempCheckerActions.changeTarget)]: updateTarget,
	[actionTag(TempCheckerActions.updateState)]: updateState
};
module.exports = TempCheckerStore;

function getDefaultState() {
	return Map({
		target: null,
		hysteresis: null,
		rising: false,
		state: true
	});
}


function updateState(payload, state) {
	const newState = payload.tempChecker;

	if (typeof newState.rising !== 'undefined') {
		state = state.set('rising', newState.rising);
	}

	if (typeof newState.state !== 'undefined') {
		state = state.set('state', newState.state);
	}

	return state;
}

function updateTarget(payload, state) {
	const newTarget = payload.tempChecker;

	if (typeof newTarget.target !== 'undefined') {
		state = state.set('target', newTarget.target);
	}

	if (typeof newTarget.hysteresis !== 'undefined') {
		state = state.set('hysteresis', newTarget.hysteresis);
	}

	return state;
}
