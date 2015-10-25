var Map = require('immutable').Map;

var VALUES = 5;

module.exports = function(action, state) {
	if (!state) {
		state = getDefaultState();
	}

	if (action && action.payload && action.payload.zones) {
		state = update(action.payload.zones, state);
	}

	return state;
};

function getDefaultState() {
	return Map({
		default: Map({
			id: 'default',
			values: [],
			priority: 0.1,
			name: 'Default zone'
		})
	});
}

function update(zones, state) {
	zones.forEach(function(zone) {
		var newZone;
		if (zone && state.has(zone.id)) {
			newZone = updateZone(state.get(zone.id), zone);
		}
		else if (zone) {
			newZone = createZone(zone);
		}

		state = state.set(newZone.get('id'), newZone);
	});

	return state;
}

function createZone(initialData) {
	return Map({
		id: initialData.id,
		values: [initialData.value],
		priority: initialData.priority,
		name: initialData.name,
		lastUpdate: initialData.time
	});
}

function updateZone(zone, updateData) {
	var values = zone.get('values').slice(0, VALUES);
	values.unshift(updateData.value);

	return zone
		.set('values', values)
		.set('priority', updateData.meta)
		.set('name', updateData.name)
		.set('lastUpdate', updateData.time);
}
