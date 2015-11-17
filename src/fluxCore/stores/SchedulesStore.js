var Map = require('immutable').Map;
var RootActions = require('../actions').Root;
var SchedulesActions = require('../actions').Schedules;


function SchedulesStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	switch (type) {
		case RootActions.loadFromDB.actionType:
		case SchedulesActions.create.actionType:
		case SchedulesActions.update.actionType:
			state = updateSchedules(payload.schedules, state);
			break;
		case SchedulesActions.delete.actionType:
			state = removeSchedules(payload.deletedSchedules, state);
			break;
	}

	return state;
}

module.exports = SchedulesStore;


function getDefaultState() {
	return Map({
		default: createSchedule({
			id: 'default',
			name: 'default',
			startTemp: 20.5,
			changesResolution: 900000,
			changes: []
		})
	});
}

function createSchedule(scheduleData) {
	return Map({
		id: scheduleData.id.toString(),
		name: scheduleData.name,
		startTemp: scheduleData.startTemp,
		changesResolution: scheduleData.changesResolution,
		changes: scheduleData.changes // Optional parse
	});
}

function updateSchedules(schedules, state) {
	if (schedules) {
		schedules.forEach(function(schedule) {
			var newSchedule;

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

function removeSchedules(schedules, state) {
	schedules.forEach(function(scheduleId) {
		state = state.delete(scheduleId);
	});

	return state;
}
