'use strict';
const Map = require('immutable').Map;
const ScheduleActions = require('./ScheduleActions');
const actionTag = require('fluxerino').Utils.actionTag;

const SchedulesStore = {
	'Lifecycle.Init': function getDefaultState() {
		return Map({
			temperature: null,
			hysteresis: null
		});
	},
	[actionTag(ScheduleActions.changeTarget)]: function changeTarget(payload) {
		const newTarget = payload.scheduleTarget;

		return Map({
			temperature: newTarget.temperature,
			hysteresis: newTarget.hysteresis
		});
	}
};
module.exports = SchedulesStore;
