'use strict';
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
	return Map({
		0: Map({}),
		1: Map({}),
		2: Map({}),
		3: Map({}),
		4: Map({}),
		5: Map({}),
		6: Map({})
	});
}

function createChange(changeData) {
	return Map({
		id: changeData.id,
		day: changeData.day,
		startTime: changeData.startTime,
		changeLength: changeData.changeLength,
		newTemp: changeData.newTemp,
		newHyst: changeData.newHyst,
		isActive: changeData.isActive,
		tag: changeData.tag
	});
}

function updateSchedule(payload, state) {
	const changes = payload.scheduleChanges;

	if (changes.length === 1) {
		return state.mergeIn([changes[0].day, changes[0].startTime], createChange(changes[0]));
	}

	return state.withMutations((state) => {
		changes.forEach((change) => {
			state.mergeIn([change.day, change.startTime], createChange(change));
		});
	});
}

function removechanges(payload, state) {
	const removedChanges = payload.deletedScheduleChanges;

	if (payload.scheduleChanges) {
		return updateSchedule(payload, state);
	}

	if (removedChanges.length === 1) {
		return state.deleteIn([removedChanges[0].day, removedChanges[0].startTime]);
	}

	return state.withMutations((state) => {
		removedChanges.forEach((change) => {
			state.deleteIn([change.day, change.startTime], change);
		});
	});
}
