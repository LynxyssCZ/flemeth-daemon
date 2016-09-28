'use strict';
const Map = require('immutable').Map;
const SwitcherActions = require('./SwitcherActions');
const actionTag = require('fluxerino').Utils.actionTag;

const SwitcherStore = {
	'Lifecycle.Init': getDefaultState,
	[actionTag(SwitcherActions.switch)]: flipSwitch,
	[actionTag(SwitcherActions.unlock)]: unlockSwitcher
};
module.exports = SwitcherStore;

function getDefaultState() {
	return Map({
		locked: false,
		realValue: null,
		nextValue: null,
		lockStart: null
	});
}

function unlockSwitcher(payload, state) {
	if (state.get('locked')) {
		state = state.set('locked', false);
		state = state.set('lockStart', null);

		state = flipSwitch({
			switcher: {
				value: state.get('nextValue')
			}
		}, state);
	}

	return state;
}

function flipSwitch(payload, state) {
	const isLocked = state.get('locked');
	const newValue = payload.switcher.value;
	const isForced = payload.switcher.forced;

	if (isLocked && !isForced) {
		// Locked, update nextValue, leave locked
		state = state.set('nextValue', newValue);
	}
	else if (state.get('realValue') !== newValue) {
		state = state.merge({
			locked: true,
			realValue: newValue,
			nextValue: newValue
		});


		if (!isLocked) {
			state = state.set('lockStart', Date.now());
		}
	}

	return state;
}
