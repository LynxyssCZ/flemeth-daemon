'use strict';
const ZonesStore = require('./ZonesStore');
const ZonesMeanStore = require('./ZonesMeanStore');
const ZonesActions = require('./ZonesActions');
const ZonesApi = require('./ZonesApi');
const ZoneModel = require('./ZoneModel');

class ZonesManager {
	constructor(app) {
		this.app = app;
		this.logger = app.logger.child({component: 'ZonesManager'});
		this.flux = app.methods.flux;

		this.app.addMethod('zones.create', this.createZone.bind(this));
		this.app.addMethod('zones.update', this.updateZone.bind(this));
		this.app.addMethod('zones.remove', this.removeZone.bind(this));
		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));
		this.app.addHook('lifecycle.stop', this.onAppStop.bind(this));
		this.app.addHook('snapshots.collect', this.onCollectSnapshot.bind(this));

		this.app.methods.flux.addStore('Zones', ZonesStore);
		this.app.methods.flux.addStore('ZonesMean', ZonesMeanStore);
		this.app.methods.db.registerModel('Zones', ZoneModel);
		this.app.methods.persistence.add('Zones', 'zones');
		this.app.methods.api.addEndpoint('zones', ZonesApi);
	}

	createZone(zoneData, next) {
		this.flux.push(ZonesActions.create, [zoneData], next);
	}

	updateZone(zoneData, next) {
		this.flux.push(ZonesActions.update, [zoneData], next);
	}

	removeZone(zoneId, next) {
		this.flux.push(ZonesActions.remove, [zoneId], next);
	}

	// Hooks
	onAppStart(payload, next) {
		this.logger.info('Starting');

		this.sensorsSub = this.flux.subscribe(this.updateZones.bind(this), [
			'Sensors'
		]);

		this.zonesSub = this.flux.subscribe(this.updateMean.bind(this), [
			'Zones'
		]);

		next();
	}

	onAppStop(payload, next) {
		this.logger.info('Stopping');
		this.flux.unsubscribe(this.sensorsSub);
		this.flux.unsubscribe(this.zonesSub);
		next();
	}

	onCollectSnapshot(payload, next) {
		this.logger.debug('Snapshot collection');

		const zones = this.flux.getSlice('Zones').filter((zone) => {
			return zone.get('lastUpdate') > payload.lastUpdate;
		}).map((zone) => {
			return {
				zoneId: zone.get('id'),
				temp: zone.get('value')
			};
		});

		payload.snapshots.push({
			type: 'zones_temps',
			data: zones.toArray()
		});

		global.setTimeout(next, 0, null, payload);
	}

	updateZones() {
		const state = this.flux.getSlice(['Zones', 'Sensors']);

		const zonesValues = state.Zones.map(function(zone) {
			const sensorsValue = this.getSensorsValue(zone.get('id') === 'global' ? '*' : zone.get('sensors'), state.Sensors);

			return {
				id: zone.get('id'),
				lastUpdate: zone.get('lastUpdate') >= sensorsValue.lastUpdate ? null : sensorsValue.lastUpdate,
				value: sensorsValue.value
			};
		}, this).filter(function(zoneUpdate) {
			return zoneUpdate.lastUpdate > 0;
		}, this).toArray();

		if (zonesValues.length) {
			this.flux.push(ZonesActions.updateValues, [zonesValues]);
		}
	}

	updateMean() {
		const zones = this.flux.getSlice('Zones');
		const current = this.flux.getSlice('ZonesMean').get('temperature');

		const data = zones.reduce(function(result, zone) {
			const weight = zone.get('priority');
			const value = zone.get('value');

			if (weight && value) {
				result = {
					valuesSum: result.valuesSum + (weight * value),
					weightsSum: result.weightsSum + weight
				};
			}

			return result;
		}, {
			valuesSum: 0,
			weightsSum: 0
		});

		let zonesMean = data.weightsSum
			? Number((data.valuesSum / data.weightsSum).toFixed(3))
			: null;

		if (zonesMean !== current) {
			this.flux.push(ZonesActions.updateMean, [zonesMean, zones.size]);
		}
	}

	getSensorsValue(ids, sensors) {
		var validIds = [];
		if (ids && Array.isArray(ids)) {
			validIds = ids.filter(function(sensorId) {
				return sensors.has(sensorId);
			});
		}
		else if (ids === '*') {
			validIds = sensors.keySeq().toArray();
		}

		var temp = validIds.reduce(function(reduction, sensorId) {
			var sensor = sensors.get(sensorId);
			reduction[0].push(sensor.get('average'));
			reduction[1].push(sensor.get('lastUpdate'));
			return reduction;
		}, [[], []]);

		return {
			lastUpdate: Math.max.apply(Math, temp[1]),
			value: mean(temp[0])
		};
	}
}

module.exports = ZonesManager;

function mean(array) {
	var sum = 0, i;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return array.length ? sum / array.length : 0;
}
