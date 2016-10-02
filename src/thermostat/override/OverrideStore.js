'use strict';
const Map = require('immutable').Map;
const OverrideActions = require('./OverrideActions');
const actionTag = require('fluxerino').Utils.actionTag;

const OverrideStore = {
	'Lifecycle.Init': getDefaultState,
	[actionTag(OverrideActions.createSwitchOverride)]: function(payload) {
		return Map({
			switchValue: payload.override.switchValue,
			reason: payload.override.reason,
			length: payload.override.length,
			created: payload.override.created
		});
	},
	[actionTag(OverrideActions.createTargetOverride)]: function(payload) {
		return Map({
			target: Map(payload.override.target),
			reason: payload.override.reason,
			length: payload.override.length,
			created: payload.override.created
		});
	},
	[actionTag(OverrideActions.update)]: function(payload, state) {
		if (state.get('target')) {
			return state.merge({
				target: payload.override.target === undefined
					? state.get('target')
					: payload.override.target,
				reason: payload.override.reason,
				length: payload.override.length
			});
		}
		else {
			return state.merge({
				switchValue: payload.override.switchValue === undefined
					? state.get('switchValue')
					: payload.override.switchValue,
				reason: payload.override.reason,
				length: payload.override.length
			});
		}
	},
	[actionTag(OverrideActions.remove)]: getDefaultState
};
module.exports = OverrideStore;

function getDefaultState() {
	return Map({});
}
