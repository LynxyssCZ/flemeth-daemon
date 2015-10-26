var Map = require('immutable').Map;

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
			value: null,
			priority: 0.1,
			name: 'Default zone'
		})
	});
}

function update(zones, state) {
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
		priority: initialData.priority,
		name: initialData.name,
		lastUpdate: initialData.time
	});
}
