var switcherApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

switcherApi.register.attributes = {
	name: 'switcher-api',
	version: '1.0.0'
};

module.exports = switcherApi;

var handlers = {
	getRaw: function(req, reply) {
		return reply({
			switcher: req.server.app.container.getState('Switcher')
		});
	}
};

var endpoints = [
	{
		path: '/',
		method: 'GET',
		handler: handlers.getRaw,
		config: {
			description: 'Reads switcher value',
			tags: ['api', 'switcher']
		}
	}
];
