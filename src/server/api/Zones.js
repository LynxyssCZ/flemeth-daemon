var Joi = require('joi');

var zoneSchema = Joi.object().meta({ className: 'Zone' }).keys({
	name: Joi.string().min(5).max(50).required(),
	sensors: Joi.array().items(Joi.string().required()).unique(),
	priority: Joi.number().min(0).precision(2).max(150).default(1)
});

var zoneIdSchema = Joi.string().meta({ className: 'ZoneId' }).lowercase().invalid('global');

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
			zones: req.server.app.container.getState('Zones').toArray()
		});
	},
	create: function(req, reply) {
		var container = req.server.app.container;

		var zone = {
			name: req.payload.name,
			sensors: req.payload.sensors,
			priority: req.payload.priority
		};

		return container.push(container.actions.Zones.create, [zone], function(error, payload) {
			if (!error) {
				return reply({
					msg: 'OK',
					zones: payload.zones
				}).code(201);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	},
	update: function(req, reply) {
		var container = req.server.app.container;
		var zoneId = req.params.zoneId;

		var zone = {
			id: zoneId,
			name: req.payload.name,
			sensors: req.payload.sensors,
			priority: req.payload.priority
		};

		return container.push(container.actions.Zones.update, [zone], function(error, payload) {
			if (!error) {
				return reply({
					msg: 'OK',
					zones: payload.zones
				}).code(202);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	},
	delete: function(req, reply) {
		var container = req.server.app.container;
		var zoneId = req.params.zoneId;

		container.push(container.actions.Zones.delete, [zoneId], function(err) {
			if (!error) {
				return reply({
					msg: 'OK'
				});
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
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
				payload: zoneSchema
			}
		}
	},
	{
		path: '/{zoneId}/',
		method: 'PUT',
		handler: handlers.update,
		config: {
			description: 'Update a zone',
			notes: [
				'Can change everything apart from ID',
				'Global zone is untouchable'
			],
			tags: ['api', 'zones'],
			validate: {
				params: {
					zoneId: zoneIdSchema.required()
				},
				payload: zoneSchema
			}
		}
	},
	{
		path: '/{zoneId}/',
		method: 'DELETE',
		handler: handlers.delete,
		config: {
			description: 'Delete zone from system',
			tags: ['api', 'zones'],
			validate: {
				params: {
					zoneId: zoneIdSchema.required()
				}
			}
		}
	}
];
