var Map = require('immutable').Map;

module.exports = function(action, state) {
	if (!state) {
		state = getDefaultState();
	}

	if (action && action.payload) {
		if (action.payload.zones) {
			state = updateZones(action.payload.zones, state);
		}

		if (action.payload.deletedZones) {
			state = deleteZones(action.payload.deletedZones, state);
		}
	}


	return state;
};

function getDefaultState() {
	return Map({
		global: Map({
			id: 'global',
			value: null,
			priority: 0,
			name: 'Global zone (for debugging purposes only)'
		})
	});
}

function deleteZones(zones, state) {
	zones.forEach(function(zoneId) {
		state = state.delete(zoneId);
	});

	return state;
}

function updateZones(zones, state) {
	zones.forEach(function(zone) {
		var newZone;
		if (zone && state.has(zone.id)) {
			newZone = state.get(zone.id).merge(zone);
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
		value: initialData.value,
		sensors: initialData.sensors,
		priority: initialData.priority || 1,
		name: initialData.name,
		lastUpdate: initialData.time || null
	});
}
