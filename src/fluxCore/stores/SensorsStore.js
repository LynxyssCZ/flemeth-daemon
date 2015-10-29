var Map = require('immutable').Map;

var VALUES = 5;

module.exports = function(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	if (type === 'Sensors.readFrame') {
		state = update(payload.sensors, state);
	}

	return state;
};

function getDefaultState() {
	return Map();
}

function update(sensors, state) {
	sensors.forEach(function(sensor) {
		var newSensor;
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
