'use strict';
const Map = require('immutable').Map;
const SensorsActions = require('../actions/SensorsActions');
const actionTag = require('fluxerino').Utils.actionTag;
const VALUES = 5;

const SensorsStore = {
	'Lifecycle.Init': function getDefaultState() {
		return Map();
	},
	[actionTag(SensorsActions.readFrame)]: function readFrame(payload, state) {
		payload.sensors.forEach(function(sensor) {
			let newSensor;
			if (sensor && state.has(sensor.sensorId)) {
				newSensor = updateSensor(state.get(sensor.sensorId), sensor);
			}
			else if (sensor) {
				newSensor = createSensor(sensor);
			}

			state = state.set(newSensor.get('id'), newSensor);
		});

		return state;
	}
};
module.exports = SensorsStore;

function createSensor(initialData) {
	return Map({
		id: initialData.sensorId,
		type: initialData.type,
		reader: initialData.reader,
		values: [initialData.value],
		average: initialData.value,
		meta: initialData.meta,
		lastUpdate: initialData.time
	});
}

function updateSensor(sensor, updateData) {
	switch (sensor.get('type')) {
		case 'temp':
			return updateTempSensor(sensor, updateData);
		default:
			return createSensor(updateData);
	}
}

function updateTempSensor(sensor, updateData) {
	var values = sensor.get('values').slice(0, VALUES);
	values.unshift(updateData.value);

	return sensor
		.set('values', values)
		.set('average', mean(values))
		.set('meta', updateData.meta)
		.set('lastUpdate', updateData.time);
}

function mean(array) {
	var sum = 0, i;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return array.length ? sum / array.length : 0;
}
