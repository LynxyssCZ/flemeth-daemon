var Joi = require('joi');

var querySchema = Joi.object({
	sensors: Joi.string().default(''),
	from: Joi.number().integer().positive().default(Date.now() - 85800000),
	to: Joi.number().integer().positive().greater(Joi.ref('from')).default(Date.now())
});

var sensorsValuesApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

sensorsValuesApi.register.attributes = {
	name: 'sensorsValues-api',
	version: '1.0.0'
};

module.exports = sensorsValuesApi;

var handlers = {
	get: function(req, reply) {
		var container = req.server.app.container;
		var fromTs = req.query.from;
		var toTs = req.query.to;
		var sensors = req.query.sensors ? req.query.sensors.split(';') : undefined;

		return container.push(container.actions.SensorsValues.read, [fromTs, toTs, sensors], function(err, payload) {
			return reply({
				msg: err ? err : 'Ok',
				sensorsValues: err ? undefined : payload.sensorsValues
			});
		});
	}
};

var endpoints = [
	{
		path: '/',
		method: 'GET',
		handler: handlers.get,
		config: {
			description: 'Reads sensors values',
			tags: ['api', 'sensors-values'],
			validate: {
				query: querySchema
			}
		}
	}
];
