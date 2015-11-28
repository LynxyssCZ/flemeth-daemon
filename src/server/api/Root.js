var rootApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

rootApi.register.attributes = {
	name: 'root-api',
	version: '1.0.0'
};

module.exports = rootApi;

var handlers = {
	getDashboard: function(req, reply) {
		var state = req.server.app.container.getState([
			'Override',
			'Switcher',
			'TempChecker',
			'Zones'
		]);

		return reply({
			override: state.Override,
			switcher: state.Switcher,
			tempChecker: state.TempChecker,
			zones: state.Zones.toArray()
		});
	}
};

var endpoints = [
	{
		path: '/dashboard/',
		method: 'GET',
		handler: handlers.getDashboard,
		config: {
			description: 'Dashboard getter.',
			tags: ['api', 'root']
		}
	}
];
