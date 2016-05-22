'use strict';
const handlers = {
	getRaw: function(req, reply) {
		return reply({
			switcher: this.flux.getSlice('Switcher')
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
				description: 'Reads switcher value',
				tags: ['api', 'switcher']
			}
		}
	]
};
