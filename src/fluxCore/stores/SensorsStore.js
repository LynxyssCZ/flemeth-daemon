var Map = require('immutable').Map;

var VALUES = 5;

module.exports = function(action, state) {
	if (!state) {
		state = getDefaultState();
	}

	if (action && action.payload && action.payload.sensors) {
		state = update(action.payload.sensors, state);
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
			newSensor = updateSensor(sensor, state.get(sensor.sensorId));
		}
		else if (sensor) {
			newSensor = createSensor(sensor);
		}

		state = state.set(newSensor.id, newSensor);
	});

	return state;
}

function createSensor(initialData) {
	return Map({
		id: initialData.sensorId,
		type: initialData.type,
		reader: initialData.reader,
		values: [initialData.value],
		meta: initialData.meta,
		lastUpdate: initialData.time
	});
}

function updateSensor(sensor, updateData) {
	switch (sensor.type) {
		case 'temp':
			return updateTempSensor(sensor, updateData);
		default:
			return createSensor(updateData);
	}
}

function updateTempSensor(sensor, updateData) {
	var values = sensor.get('values').slice(0, VALUES);
	values.unshift(updateData.value);

	return sensor.merge({
		values: values,
		meta: updateData.meta,
		lastUpdate: updateData.time
	});
}
