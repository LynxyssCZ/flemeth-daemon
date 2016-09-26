'use strict';
const Map = require('immutable').Map;
const actionTag = require('fluxerino').Utils.actionTag;
const ZonesActions = require('./ZonesActions');

const ZonesMeanStore = {
	'Lifecycle.Init': getDefaultState,
	[actionTag(ZonesActions.updateMean)]: updateMean
};

module.exports = ZonesMeanStore;

function getDefaultState() {
	return Map({
		temperature: null
	});
}

function updateMean(payload) {
	return Map({
		temperature: payload.temperature,
		zonesCount: payload.zonesCount
	});
}
