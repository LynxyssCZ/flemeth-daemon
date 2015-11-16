var tempCheckerApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

tempCheckerApi.register.attributes = {
	name: 'tempChecker-api',
	version: '1.0.0'
};

module.exports = tempCheckerApi;

var handlers = {
	getRaw: function(req, reply) {
		return reply({
			tempChecker: req.server.app.container.getState('TempChecker')
		});
	}
};

var endpoints = [
	{
		path: '/',
		method: 'GET',
		handler: handlers.getRaw,
		config: {
			description: 'Reads temperature checker value',
			tags: ['api', 'temp-checker']
		}
	}
];
