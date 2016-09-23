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

		app.addMethod('sensors.readFrame', this.readSensorFrame.bind(this));
	}

	readSensorFrame(reader, frame, next) {
		this.logger.debug({
			method: 'readSensorFrame',
			reader: reader,
			frame: frame
		});

		this.flux.push(actions.readFrame, [frame], next);
	}
}

module.exports = SensorsManager;
