var Map = require('immutable').Map;
var ZonesActions = require('../actions').Zones;

module.exports = function(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	switch (type) {
		case ZonesActions.updateValues.actionType:
			state = updateZones(payload.zones, state);
			break;
		case ZonesActions.create.actionType:
			state = createZones(payload.zones, state);
			break;
		case ZonesActions.delete.actionType:
			state = deleteZones(payload.deletedZones, state);
			break;
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
		var newZone = state.get(zone.id).merge(zone);

		state = state.set(newZone.get('id'), newZone);
	});

	return state;
}

function createZones(zones, state) {
	return zones.reduce(function(zones, zoneData) {
		var newZone = createZone(zoneData);

		return zones.set(newZone.get('id'), newZone);
	}, state);
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
