'use strict';
const Joi = require('joi');
const Boom = require('boom');

const simpleChangeSchema = Joi.object().meta({ className: 'Change' }).keys({
	newTemp: Joi.number().min(7).precision(1).max(38).optional().default(21.5),
	newHyst: Joi.number().precision(2).min(0).max(5).optional().default(2),
	changeLength: Joi.number().integer().positive().max(45).default(15),
	isActive: Joi.boolean().default(true),
	tag: Joi.string().optional()
}).or('newTemp', 'newHyst');

const handlers = {
	getRaw: function(req, reply) {
		return reply({
			schedule: this.flux.getSlice('Schedule').toJS()
		});
	},
	insert: function insertChange(req, reply) {
		const change = req.payload;
		const day = req.params.day;
		const startTime = req.params.startTime;

		return this.app.methods.schedule.insert(Object.assign({
			day: day,
			startTime: startTime
		}, change), (error, payload) => {
			if (!error) {
				return reply({
					msg: 'OK',
					scheduleChanges: payload.scheduleChanges
				}).code(201);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	},
	remove: function removeChange(req, reply) {
		const day = req.params.day;
		const startTime = req.params.startTime;

		return this.app.methods.schedule.remove({
			day: day,
			startTime: startTime
		}, (error, payload) => {
			if (!error) {
				return reply({
					msg: 'OK',
					deletedScheduleChanges: payload.deletedScheduleChanges
				}).code(201);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	}
};

module.exports = {
	endpoints: [
		{
			path: '/',
			method: 'GET',
			handler: handlers.getRaw,
			config: {
				description: 'Get all changes.',
				notes: ['Returns all', 'No filtering', 'Raw from core'],
				tags: ['api', 'schedule', 'changes']
			}
		},
		{
			path: '/{day}/{startTime}/',
			method: 'PUT',
			handler: handlers.insert,
			config: {
				description: 'Insert a change into schedule',
				tags: ['api', 'schedule', 'changes'],
				validate: {
					params: {
						day: Joi.number().min(0).max(6).required(),
						startTime: Joi.number().min(0).max(1439).required()
					},
					payload: simpleChangeSchema
				}
			}
		},
		{
			path: '/{day}/{startTime}/',
			method: 'DELETE',
			handler: handlers.remove,
			config: {
				description: 'Remove a change from schedule',
				tags: ['api', 'schedule', 'changes'],
				validate: {
					params: {
						day: Joi.number().min(0).max(6).required(),
						startTime: Joi.number().min(0).max(1439).required()
					}
				}
			}
		}
	]
};
