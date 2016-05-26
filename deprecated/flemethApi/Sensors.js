const handlers = {
	getRaw: function(req, reply) {
		return reply({
			sensors: this.flux.getSlice('Sensors').toArray()
		});
	}
};

module.exports = {
	endpoints: [
		{
			path: '/',
			method: 'GET',
			handler: handlers.getRaw,
			config: {
				description: 'Base sensors getter.',
				notes: ['Returns all', 'No filtering', 'Raw from core'],
				tags: ['api', 'sensors']
			}
		}
	]
};
