var Joi = require('joi');

var querySchema = Joi.object({
	types: Joi.string().default(''),
	from: Joi.number().integer().positive(),
	to: Joi.number().integer().positive().greater(Joi.ref('from'))
});

var snapshotsApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

snapshotsApi.register.attributes = {
	name: 'snapshots-api',
	version: '1.0.0'
};

module.exports = snapshotsApi;

var handlers = {
	get: function(req, reply) {
		var container = req.server.app.container;
		var toTs = req.query.to || Date.now();
		var fromTs = req.query.from || toTs - 85800000;
		var types = req.query.types ? req.query.types.split(';') : undefined;

		return container.push(container.actions.Snapshots.read, [fromTs, toTs, types], function(err, payload) {
			return reply({
				msg: err ? err : 'Ok',
				snapshots: err ? undefined : payload.snapshots
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
			description: 'Reads snapshots from database',
			tags: ['api', 'snapshots'],
			validate: {
				query: querySchema
			}
		}
	}
];
