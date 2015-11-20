var Joi = require('joi');

var querySchema = Joi.object({
	sensors: Joi.string().default(''),
	from: Joi.number().integer().positive(),
	to: Joi.number().integer().positive().greater(Joi.ref('from'))
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
		var toTs = req.query.to || Date.now();
		var fromTs = req.query.from || toTs - 85800000;
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
