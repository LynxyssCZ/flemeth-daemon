var sensorsApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
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
			sensors: req.server.app.container.getSlice('Sensors').toArray()
		});
	}
};

var endpoints = [
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
];
