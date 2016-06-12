module.exports = {
	readFrame: function readSensorFrame(frame) {
		const reader = frame.reader;
		const samples = frame.samples;

		return {
			sensors: samples.map((sample) => {
				return Object.assign({
					reader: reader
				}, sample);
			})
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
