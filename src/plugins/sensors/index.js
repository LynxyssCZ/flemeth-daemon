'use strict';
const actions = require('./SensorsActions');
const store = require('./SensorsStore');

class SensorsManager {
	constructor(app) {
		this.logger = app.logger.child({component: 'SensorsManager'});
		this.flux = app.flux;
		app.addMethod('sensors.readFrame', this.readSensorFrame.bind(this));
		app.registerStore('Sensors', store);
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
