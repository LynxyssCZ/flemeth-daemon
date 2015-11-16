var assign = require('object-assign');
var Joi = require('joi');

var temperature = Joi.number().min(7).precision(1).max(38);
var scheduleIdSchema = Joi.string().lowercase().invalid('default');

var changeSchema = Joi.object().meta({ className: 'Change' }).keys({
	startTime: Joi.number().integer().min(0).max(86400000).required(),
	newValue: temperature.required(),
	length: Joi.number().integer().positive().max(15)
});

var scheduleSchema = Joi.object().meta({ className: 'Schedule' }).keys({
	name: Joi.string().min(5).max(50).required(),
	startTemp: temperature.default(20.5),
	changesResolution: Joi.number().integer().min(300000).max(3600000).default(900000), // 15 minutes
	changes: Joi.array().items(changeSchema).required().unique()
});

var schedulesApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

schedulesApi.register.attributes = {
	name: 'schedules-api',
	version: '1.0.0'
};

module.exports = schedulesApi;

var handlers = {
	getRaw: function(req, reply) {
		return reply({
			schedules: req.server.app.container.getState('Schedules')
		});
	},
	create: function(req, reply) {
		var container = req.server.app.container;
		var schedule = req.payload;

		return container.push(container.actions.Schedules.create, [schedule], function(error, payload) {
			return reply({
				msg: error ? error : 'OK',
				schedules: error ? undefined : payload.schedules
			});
		});
	},
	update: function(req, reply) {
		var container = req.server.app.container;
		var scheduleId = req.params.scheduleId;

		var schedule = assign({
			id: scheduleId
		}, req.payload);

		return container.push(container.actions.Schedules.update, [schedule], function(error, payload) {
			return reply({
				msg: error ? error : 'Ok',
				schedules: error ? undefined : payload.schedules
			});
		});
	},
	delete: function(req, reply) {
		var container = req.server.app.container;
		var scheduleId = req.params.scheduleId;

		return container.push(container.actions.Schedules.delete, [scheduleId], function(error) {
			return reply({
				msg: error ? error : 'Ok'
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
			description: 'Get all schedules.',
			notes: ['Returns all', 'No filtering', 'Raw from core'],
			tags: ['api', 'schedules']
		}
	},
	{
		path: '/',
		method: 'POST',
		handler: handlers.create,
		config: {
			description: 'Create a schedule',
			tags: ['api', 'schedules'],
			validate: {
				payload: scheduleSchema
			}
		}
	},
	{
		path: '/{scheduleId}',
		method: 'PUT',
		handler: handlers.update,
		config: {
			description: 'Update a schedule',
			tags: ['api', 'schedules'],
			validate: {
				params: {
					scheduleId: scheduleIdSchema.required()
				},
				payload: scheduleSchema
			}
		}
	},
	{
		path: '/{scheduleId}',
		method: 'DELETE',
		handler: handlers.delete,
		config: {
			description: 'Delete schedule from system',
			tags: ['api', 'schedules'],
			validate: {
				params: {
					scheduleId: scheduleIdSchema.required()
				}
			}
		}
	}
];
