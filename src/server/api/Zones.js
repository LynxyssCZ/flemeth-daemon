var Joi = require('joi');

var zonesApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
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
	},
	create: function(req, reply) {
		var zone = {
			name: req.payload.name,
			sensors: req.payload.sensors,
			priority: req.payload.priority
		};

		req.server.settings.app.actions.Zones.createZone(zone, function(err, zoneId, action) {
			req.server.settings.app.container.dispatch(action);
			var state = req.server.settings.app.container.getState(['Zones']);
			var zone = state.Zones.get(zoneId);

			return reply({
				msg: 'Ok',
				result: zone
			});
		});
	},
	delete: function(req, reply) {
		var zoneId = req.params.zoneId;

		req.server.settings.app.actions.Zones.deleteZone(zoneId, function(err, action) {
			req.server.settings.app.container.dispatch(action);
			return reply({
				msg: 'Ok'
			});
		});
	}
};

var endpoints = [
	{
		path: '/',
		method: 'GET',
		handler: handlers.getRaw,
		config: {
			description: 'Base zones getter.',
			notes: ['Returns all', 'No filtering', 'Raw from core'],
			tags: ['api', 'zones']
		}
	},
	{
		path: '/',
		method: 'POST',
		handler: handlers.create,
		config: {
			description: 'Create a zone',
			notes: ['Can assign sensors'],
			tags: ['api', 'zones'],
			validate: {
				payload: {
					name: Joi.string().min(5).max(50).required(),
					sensors: Joi.array().items(Joi.string().required()).unique(),
					priority: Joi.number().positive().precision(2).max(150).default(1)
				}
			}
		}
	},
	{
		path: '/{zoneId}',
		method: 'DELETE',
		handler: handlers.delete,
		config: {
			description: 'Delete zone from system',
			tags: ['api', 'zones'],
			validate: {
				params: {
					zoneId: Joi.string().lowercase().invalid('global').required()
				}
			}
		}
	}
];
