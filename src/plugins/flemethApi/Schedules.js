'use strict';
const Joi = require('joi');
const Boom = require('boom');

const temperature = Joi.number().min(7).precision(1).max(38);
const hysteresis = Joi.number().precision(2).min(0).max(5).default(2);
const scheduleIdSchema = Joi.string().lowercase().invalid('default');

const simpleChangeSchema = Joi.object().meta({ className: 'Change' }).keys({
	newTemp: temperature.optional(),
	newHyst: hysteresis.optional(),
	length: Joi.number().integer().positive().max(45).default(15)
}).or('newTemp', 'newHyst');

const changeSchema = simpleChangeSchema.keys({
	startTime: Joi.number().integer().min(0).max(1440).required()
});

const scheduleSchema = Joi.object().meta({ className: 'Schedule' }).keys({
	name: Joi.string().min(5).max(50).required(),
	startTemp: temperature.default(20.5),
	startHyst: hysteresis,
	changes: Joi.array().items(Joi.array().items(changeSchema).unique().max(1440)).length(7).optional()
});

const handlers = {
	getRaw: function(req, reply) {
		return reply({
			schedules: this.flux.getSlice('Schedules').toArray()
		});
	},
	create: function(req, reply) {
		const container = this.flux;
		const schedule = req.payload;

		return container.push(container.actions.Schedules.create, [schedule], function(error, payload) {
			if (!error) {
				return reply({
					msg: 'OK',
					schedules: payload.schedules
				}).code(201);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	},
	update: function(req, reply) {
		const container = this.flux;
		const scheduleId = req.params.scheduleId;

		const schedule = Object.assign({
			id: scheduleId
		}, req.payload);

		return container.push(container.actions.Schedules.update, [schedule], function(error, payload) {
			if (!error) {
				return reply({
					msg: 'OK',
					schedules: payload.schedules
				}).code(202);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	},
	delete: function(req, reply) {
		const container = this.flux;
		const scheduleId = req.params.scheduleId;

		return container.push(container.actions.Schedules.delete, [scheduleId], function(error) {
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

const changesHandlers = {
	insert: function insertChange(req, reply) {
		return reply(Boom.notImplemented());
	},
	remove: function removeChange(req, reply) {
		return reply(Boom.notImplemented());
	}
};

module.exports = {
	endpoints: [
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
			path: '/{scheduleId}/',
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
			path: '/{scheduleId}/',
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
		},
		{
			path: '/{scheduleId}/changes/{day}/{time}/',
			method: 'PUT',
			handler: changesHandlers.insert,
			config: {
				description: 'Insert a change into schedule',
				tags: ['api', 'schedules', 'changes'],
				validate: {
					params: {
						scheduleId: scheduleIdSchema.required(),
						day: Joi.number().min(0).max(1439).required(),
						time: Joi.number().min(0).max(10079).required()
					},
					payload: simpleChangeSchema
				}
			}
		},
		{
			path: '/{scheduleId}/changes/{day}/{time}/',
			method: 'DELETE',
			handler: changesHandlers.remove,
			config: {
				description: 'Remove a change from schedule',
				tags: ['api', 'schedules', 'changes'],
				validate: {
					params: {
						scheduleId: scheduleIdSchema.required(),
						day: Joi.number().min(0).max(1439).required(),
						time: Joi.number().min(0).max(10079).required()
					},
					payload: simpleChangeSchema
				}
			}
		}
	]
};
