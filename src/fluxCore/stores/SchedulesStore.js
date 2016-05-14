'use strict';
const Map = require('immutable').Map;
const RootActions = require('../actions/RootActions');
const SchedulesActions = require('../actions/SchedulesActions');
const actionTag = require('fluxerino').Utils.actionTag;

const SchedulesStore = {
	'Lifecycle.Init': getDefaultState,
	[actionTag(RootActions.loadFromDB)]: updateSchedules,
	[actionTag(SchedulesActions.create)]: updateSchedules,
	[actionTag(SchedulesActions.update)]: updateSchedules,
	[actionTag(SchedulesActions.delete)]: removeSchedules
};
module.exports = SchedulesStore;

function getDefaultState() {
	return Map({
		default: createSchedule({
			id: 'default',
			name: 'default',
			startTemp: 20.5,
			startHyst: 2,
			changes: [[], [], [], [], [], [], []]
		})
	});
}

function createSchedule(scheduleData) {
	return Map({
		id: scheduleData.id.toString(),
		name: scheduleData.name,
		startTemp: scheduleData.startTemp,
		startHyst: scheduleData.startHyst,
		changes: scheduleData.changes
	});
}

function updateSchedules(payload, state) {
	const schedules = payload.schedules;

	if (schedules) {
		schedules.forEach(function(schedule) {
			let newSchedule;

			if (state.has(schedule.id)) {
				newSchedule = state.get(schedule.id).merge(Map(schedule));
			}
			else {
				newSchedule = createSchedule(schedule);
			}

			state = state.set(newSchedule.get('id'), newSchedule);
		});
	}

	return state;
}

function removeSchedules(payload, state) {
	payload.deletedSchedules.forEach(function(scheduleId) {
		state = state.delete(scheduleId);
	});

	return state;
}
