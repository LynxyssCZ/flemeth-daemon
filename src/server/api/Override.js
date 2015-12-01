var Joi = require('joi');
var Boom = require('boom');


var overrideSchema = Joi.object().meta({ className: 'Override' }).keys({
	reason: Joi.string().min(5).max(50).required(),
	value: Joi.boolean().default(true),
	length: Joi.number().min(0).precision(2).max(600).default(15)
});

var overrideApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

overrideApi.register.attributes = {
	name: 'override-api',
	version: '1.0.0'
};

module.exports = overrideApi;

var handlers = {
	getRaw: function(req, reply) {
		return reply({
			override: req.server.app.container.getState('Override')
		});
	},
	create: function(req, reply) {
		var container = req.server.app.container;
		var override = {
			reason: req.payload.reason,
			value: req.payload.value,
			length: req.payload.length
		};

		return container.push(container.actions.Override.create, [override], function(error, payload) {
			if (!error) {
				return reply({
					msg: 'OK',
					override: payload.override
				}).code(201);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	},
	update: function(req, reply) {
		var container = req.server.app.container;
		var override = {
			reason: req.payload.reason,
			value: req.payload.value,
			length: req.payload.length
		};

		if (!container.getState('Override')) {
			return reply(Boom.conflict('No override active'));
		}

		return container.push(container.actions.Override.update, [override], function(error) {
			if (!error) {
				return reply({
					msg: 'OK',
					override: container.getState('Override')
				}).code(202);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	},
	delete: function(req, reply) {
		var container = req.server.app.container;

		return container.push(container.actions.Override.delete, [], function(error) {
			if (!error) {
				return reply({
					override: container.getState('Override'),
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
			description: 'Base override getter.',
			notes: ['Raw from core'],
			tags: ['api', 'override']
		}
	},
	{
		path: '/',
		method: 'POST',
		handler: handlers.create,
		config: {
			description: 'Create an override',
			tags: ['api', 'override'],
			validate: {
				payload: overrideSchema
			}
		}
	},
	{
		path: '/',
		method: 'PUT',
		handler: handlers.update,
		config: {
			description: 'Update a override',
			tags: ['api', 'override'],
			validate: {
				payload: overrideSchema
			}
		}
	},
	{
		path: '/',
		method: 'DELETE',
		handler: handlers.delete,
		config: {
			description: 'Delete override from system',
			tags: ['api', 'override']
		}
	}
];
