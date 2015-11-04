var Map = require('immutable').Map;
var SwitcherActions = require('../actions').Switcher;


module.exports = function(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	switch (type) {
		case SwitcherActions.switch.actionType:
			state = updateSwitcher(payload.switcher, state);
			break;
		case SwitcherActions.lock.actionType:
			state = updateLock(true, state);
			break;
		case SwitcherActions.unlock.actionType:
			state = updateLock(false, state);
			break;
	}

	return state;
};


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
