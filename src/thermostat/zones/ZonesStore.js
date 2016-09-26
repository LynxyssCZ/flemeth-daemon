'use strict';
const Map = require('immutable').Map;
const actionTag = require('fluxerino').Utils.actionTag;
const ZonesActions = require('./ZonesActions');

const ZonesStore = {
	'Lifecycle.Init': getDefaultState,
	'Flemeth.loadFromDB': createZones,
	[actionTag(ZonesActions.create)]: createZones,
	[actionTag(ZonesActions.update)]: updateZones,
	[actionTag(ZonesActions.updateValues)]: updateZones,
	[actionTag(ZonesActions.delete)]: deleteZones
};

module.exports = ZonesStore;

function getDefaultState() {
	return Map({
		global: Map({
			id: 'global',
			value: null,
			priority: 0.01,
			name: 'Global zone'
		})
	});
}

function deleteZones(payload, state) {
	payload.deletedZones.forEach(function(zoneId) {
		state = state.delete(zoneId);
	});

	return state;
}

function updateZones(payload, state) {
	payload.zones.filter(function(zone) {
		return state.has(zone.id);	// Filter only existing zones
	}).forEach(function(zone) {
		const newZone = state.get(zone.id).merge(Map(zone));

		state = state.set(newZone.get('id'), newZone);
	});

	return state;
}

function createZones(payload, state) {
	const zones = payload.zones;

	return zones.reduce(function(zones, zoneData) {
		const newZone = createZone(zoneData);

		return zones.set(newZone.get('id'), newZone);
	}, state);
}

function createZone(initialData) {
	return Map({
		id: initialData.id.toString(),	// IDs are string only for brewity purposes
		value: initialData.value,
		sensors: initialData.sensors,
		priority: (initialData.priority >= 0) ? initialData.priority : 1,
		name: initialData.name,
		lastUpdate: initialData.time || null
	});
}
