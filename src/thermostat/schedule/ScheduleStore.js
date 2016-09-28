'use strict';
const MINUTES_IN_DAY = 24 * 60;
const Map = require('immutable').Map;
const ScheduleActions = require('./ScheduleActions');
const actionTag = require('fluxerino').Utils.actionTag;

const SchedulesStore = {
	'Lifecycle.Init': getDefaultState,
	'Flemeth.loadFromDB': updateSchedule,
	[actionTag(ScheduleActions.insert)]: updateSchedule,
	[actionTag(ScheduleActions.delete)]: removechanges
};
module.exports = SchedulesStore;


function getDefaultState() {
	return Map({});
}

function createChange(changeData) {
	return Map({
		id: changeData.id,
		day: changeData.day,
		startTime: changeData.startTime,
		startMinute: ((changeData.day * MINUTES_IN_DAY) + changeData.startTime),
		changeLength: changeData.changeLength,
		newTemp: changeData.newTemp,
		newHyst: changeData.newHyst,
		isActive: changeData.isActive,
		tag: changeData.tag
	});
}

function updateSchedule(payload, state) {
	const changes = payload.scheduleChanges;
	let change;

	if (changes.length === 1) {
		change = createChange(changes[0]);
		return state.mergeIn([change.get('startMinute')], change);
	}

	return state.withMutations((state) => {
		changes.forEach((changeData) => {
			change = createChange(changeData);
			state.mergeIn([change.get('startMinute')], change);
		});
	});
}

function removechanges(payload, state) {
	if (payload.scheduleChanges) {
		return updateSchedule(payload, state);
	}

	const removedChanges = payload.deletedScheduleChanges;
	let startMinute;
	if (removedChanges.length === 1) {
		startMinute = (removedChanges[0].day * MINUTES_IN_DAY + removedChanges[0].startTime);
		return state.deleteIn([startMinute]);
	}

	return state.withMutations((state) => {
		removedChanges.forEach((change) => {
			startMinute = (change.day * MINUTES_IN_DAY + change.startTime);
			state.deleteIn([startMinute]);
		});
	});
}
