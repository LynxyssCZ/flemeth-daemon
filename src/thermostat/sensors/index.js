'use strict';
const actions = require('./SensorsActions');
const store = require('./SensorsStore');
const SensorsApi = require('./SensorsApi');

class SensorsManager {
	constructor(app) {
		this.logger = app.logger.child({component: 'SensorsManager'});
		this.flux = app.methods.flux;

		app.methods.flux.addStore('Sensors', store);
		app.methods.api.addEndpoint('sensors', SensorsApi);

		app.addHook('snapshots.collect', this.onCollectSnapshot.bind(this));
		app.addMethod('sensors.readFrame', this.readSensorFrame.bind(this));
	}

	onCollectSnapshot(payload, next) {
		this.logger.debug('Snapshot collection');

		const sensors = this.flux.getSlice('Sensors').filter((sensor) => {
			return sensor.get('lastUpdate') > payload.lastUpdate;
		}).map((sensor) => {
			return {
				sensorId: sensor.get('id'),
				value: sensor.get('average'),
				meta: sensor.get('meta')
			};
		});

		payload.snapshots.push({
			type: 'sensors_values',
			data: sensors.toArray()
		});

		global.setTimeout(next, 0, null, payload);
	}

	readSensorFrame(frame, next) {
		this.logger.debug({
			method: 'readSensorFrame',
			frame: frame
		});

		this.flux.push(actions.readFrame, [frame], next);
	}
}

module.exports = SensorsManager;
