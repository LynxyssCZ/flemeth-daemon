const apiDefinitions = {
	override: require('./Override'),
	root: require('./Root'),
	schedules: require('./Schedules'),
	sensors: require('./Sensors'),
	settings: require('./Settings'),
	snapshots: require('./Snapshots'),
	switcher: require('./Switcher'),
	tempchecker: require('./TempChecker'),
	zones: require('./Zones')
};

const api = {
	register: function (server, options, next) {
		server.bind({
			app: options.app,
			flux: options.app.flux,
			db: options.app.db
		});

		Object.keys(apiDefinitions).forEach((key) => {
			server.route(getRoutes(
				apiDefinitions[key],
				options.base.concat('/').concat(key)
			));
		});

		next();
	}
};

var swaggerSpecs = {
	tags: []
};

function getRoutes(definition, basePath) {
	return definition.endpoints.map(function(route) {
		route.path = basePath.concat(route.path);
		return route;
	});
}

api.register.attributes = {
	name: 'api',
	version: '1.0.0',
	swaggerSpecs: swaggerSpecs
};

module.exports = api;
