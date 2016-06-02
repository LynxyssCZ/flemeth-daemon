module.exports = {
	readFrame: function readSensorFrame(frame) {
		var reader = frame.reader;
		var samples = frame.samples;

		var sensors = samples.map(function(sample) {
			return Object.assign({
				reader: reader
			}, sample);
		});

		return {
			sensors: sensors
		};
	},
	purge: function purgeSensors(ttl) {
		//TODO: Implement in store
		return {
			purgeSensors: {
				ttl: ttl
			}
		};
	}
};
