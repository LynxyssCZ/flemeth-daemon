'use strict';
const Map = require('immutable').Map;
const actionTag = require('fluxerino').Utils.actionTag;
const TempCheckerActions = require('./TempCheckerActions');

const TempCheckerStore = {
	'Lifecycle.Init': getDefaultState,
	[actionTag(TempCheckerActions.updateState)]: updateState
};
module.exports = TempCheckerStore;

function getDefaultState() {
	return Map({
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
