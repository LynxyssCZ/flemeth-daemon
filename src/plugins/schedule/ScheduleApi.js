'use strict';
const Joi = require('joi');
const Boom = require('boom');

const temperature = Joi.number().min(7).precision(1).max(38);
const hysteresis = Joi.number().precision(2).min(0).max(5).default(2);

const simpleChangeSchema = Joi.object().meta({ className: 'Change' }).keys({
	newTemp: temperature.optional(),
	newHyst: hysteresis.optional(),
	length: Joi.number().integer().positive().max(45).default(15),
	tag: Joi.string().optional()
}).or('newTemp', 'newHyst');

const handlers = {
	getRaw: function(req, reply) {
		return reply({
			schedule: this.flux.getSlice('Schedule').toArray()
		});
	},
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
				description: 'Get all changes.',
				notes: ['Returns all', 'No filtering', 'Raw from core'],
				tags: ['api', 'schedule', 'changes']
			}
		},
		{
			path: '/{day}/{time}/',
			method: 'PUT',
			handler: handlers.insert,
			config: {
				description: 'Insert a change into schedule',
				tags: ['api', 'schedule', 'changes'],
				validate: {
					params: {
						day: Joi.number().min(0).max(6).required(),
						time: Joi.number().min(0).max(1439).required()
					},
					payload: simpleChangeSchema
				}
			}
		},
		{
			path: '/{day}/{time}/',
			method: 'DELETE',
			handler: handlers.remove,
			config: {
				description: 'Remove a change from schedule',
				tags: ['api', 'schedule', 'changes'],
				validate: {
					params: {
						day: Joi.number().min(0).max(6).required(),
						time: Joi.number().min(0).max(1439).required()
					},
					payload: simpleChangeSchema
				}
			}
		}
	]
};
