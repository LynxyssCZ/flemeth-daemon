'use strict';
const Map = require('immutable').Map;
const OverrideActions = require('../actions/OverrideActions');
const actionTag = require('fluxerino').Utils.actionTag;

const OverrideStore = {
	'Lifecycle.Init': getDefaultState,
	[actionTag(OverrideActions.create)]: updateOverride,
	[actionTag(OverrideActions.update)]: updateOverride,
	[actionTag(OverrideActions.delete)]: getDefaultState
};
module.exports = OverrideStore;

function updateOverride(payload, state) {
	return state.merge(payload.override);
}

function getDefaultState() {
	return Map({
		reason: null,
		value: null,
		length: null,
		created: null
	});
}
