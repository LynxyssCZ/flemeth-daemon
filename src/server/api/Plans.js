var Joi = require('joi');

var planIdSchema = Joi.string().lowercase().invalid('default');

var planSchema = Joi.object().meta({ className: 'Schedule' }).keys({
	name: Joi.string().min(5).max(50).required(),
	schedules: Joi.array().items(Joi.string()).required().length(7)
});

var plansApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

plansApi.register.attributes = {
	name: 'plans-api',
	version: '1.0.0'
};

module.exports = plansApi;

var handlers = {
	getRaw: function(req, reply) {
		return reply({
			plans: req.server.app.container.getState('Plans')
		});
	},
	create: function(req, reply) {
	},
	update: function(req, reply) {
	},
	delete: function(req, reply) {
	}
};

var endpoints = [
	{
		path: '/',
		method: 'GET',
		handler: handlers.getRaw,
		config: {
			description: 'Get al plans.',
			notes: ['Returns all', 'No filtering', 'Raw from core'],
			tags: ['api', 'plans']
		}
	},
	{
		path: '/',
		method: 'POST',
		handler: handlers.create,
		config: {
			description: 'Create a plan',
			tags: ['api', 'plans'],
			validate: {
				payload: planSchema
			}
		}
	},
	{
		path: '/{planId}',
		method: 'PUT',
		handler: handlers.update,
		config: {
			description: 'Update a plan',
			tags: ['api', 'plans'],
			validate: {
				params: {
					planId: planIdSchema.required()
				},
				payload: planSchema
			}
		}
	},
	{
		path: '/{planId}',
		method: 'DELETE',
		handler: handlers.delete,
		config: {
			description: 'Delete plan from system',
			tags: ['api', 'plans'],
			validate: {
				params: {
					planId: planIdSchema.required()
				}
			}
		}
	}
];
