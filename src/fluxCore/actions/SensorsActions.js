var assign = require('object-assign');

module.exports = {
	readFrame: function(frame) {
		var reader = frame.reader;
		var samples = frame.samples;
		var sensors = samples.map(function(sample) {
			return assign({
				reader: reader
			}, sample);
		});

		return [{
			type: 'Sensors.Read',
			payload: {
				sensors: sensors
			}
		}];
	}
};
