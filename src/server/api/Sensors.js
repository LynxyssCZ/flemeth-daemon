var sensorsApi = {
	register: function (server, options, next) {
		server.route({
			path: options.base.concat('/'),
			method: 'GET',
			handler: handlers.getRaw,
			config: {
				description: 'Base sensors getter.',
				notes: ['Returns all', 'No filtering', 'Raw from core'],
				tags: ['api', 'sensors']
			}
		});
		next();
	}
};

sensorsApi.register.attributes = {
	name: 'sensors-api',
	version: '1.0.0'
};

module.exports = sensorsApi;

var handlers = {
	getRaw: function(req, reply) {
		return reply({
			sensors: req.server.settings.app.container.getState(['Sensors'])
		});
	}
};
