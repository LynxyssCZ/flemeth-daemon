var zonesApi = {
	register: function (server, options, next) {
		server.route({
			path: options.base.concat('/'),
			method: 'GET',
			handler: handlers.getRaw,
			config: {
				descrition: 'Base zones getter.',
				notes: ['Returns all', 'No filtering', 'Raw from core'],
				tags: ['api', 'zones']
			}
		});
		next();
	}
};

zonesApi.register.attributes = {
	name: 'zones-api',
	version: '1.0.0'
};

module.exports = zonesApi;

var handlers = {
	getRaw: function(req, reply) {
		return reply({
			zones: req.server.settings.app.container.getState(['Zones'])
		});
	}
};
