var Joi = require('joi');

var querySchema = Joi.object({
	zones: Joi.string().default(''),
	from: Joi.number().integer().positive().default(Date.now() - 85800000),
	to: Joi.number().integer().positive().greater(Joi.ref('from')).default(Date.now())
});

var zonesTempsApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

zonesTempsApi.register.attributes = {
	name: 'zonesTemps-api',
	version: '1.0.0'
};

module.exports = zonesTempsApi;

var handlers = {
	get: function(req, reply) {
		var container = req.server.app.container;
		var fromTs = req.query.from;
		var toTs = req.query.to;
		var zones = req.query.zones ? req.query.zones.split(';') : undefined;

		return container.push(container.actions.ZonesTemps.read, [fromTs, toTs, zones], function(err, payload) {
			return reply({
				msg: err ? err : 'Ok',
				zonesTemps: err ? undefined : payload.zonesTemps
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
			description: 'Reads zones temperatures',
			tags: ['api', 'zones-temps'],
			validate: {
				query: querySchema
			}
		}
	}
];
