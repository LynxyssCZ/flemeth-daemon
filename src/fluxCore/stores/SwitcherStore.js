'use strict';
const Map = require('immutable').Map;
const actionTag = require('fluxerino').Utils.actionTag;
const SwitcherActions = require('../actions/SwitcherActions');

const SwitcherStore = {
	'Lifecycle.Init': getDefaultState,
	[actionTag(SwitcherActions.switch)]: updateSwitcher,
	[actionTag(SwitcherActions.lock)]: function lockSwitcher(payload, state) {
		return updateLock(true, state);
	},
	[actionTag(SwitcherActions.unlock)]: function unlockSwitcher(payload, state) {
		return updateLock(false, state);
	}
};
module.exports = SwitcherStore;

function getDefaultState() {
	return Map({
		locked: false,
		realValue: false,
		nextValue: false,
		lockStart: null
	});
}

function updateLock(locked, state) {
	return state.merge({
		locked: locked,
		lockStart: locked ? Date.now() : null
	});
}

function updateSwitcher(value, state) {
	if (state.get('locked') && !value.forced) {
		// Locked, update nextValue, leave locked
		state = state.set('nextValue', value.nextValue);
	}
	else {
		// Unlocked or forced, switch and lock again
		state = updateLock(true, state.merge({
			realValue: value.nextValue,
			nextValue: value.nextValue
		}));
	}

	return state;
}
