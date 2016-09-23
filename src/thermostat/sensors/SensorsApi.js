'use strict';

const handlers = {
	sensorsGetRaw(req, reply) {
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
			handler: handlers.sensorsGetRaw,
			config: {
				description: 'Get all changes.',
				notes: ['Returns all', 'No filtering', 'Raw from core'],
				tags: ['api', 'schedule', 'changes']
			}
		}
	]
};
