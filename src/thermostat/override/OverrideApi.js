'use strict';
const Joi = require('joi');
const Boom = require('boom');

const overrideSchema = Joi.object().meta({ className: 'Override' }).keys({
	reason: Joi.string().min(5).max(50).required(),
	switchValue: Joi.boolean(),
	target: Joi.object().keys({
		temperature: Joi.number().min(7).precision(1).max(38).optional().default(21.5),
		hysteresis: Joi.number().precision(2).min(0).max(5).optional().default(2)
	}),
	length: Joi.number().min(0).precision(2).max(600).default(15)
}).xor('switchValue', 'target');

const handlers = {
	getRaw: function(req, reply) {
		return reply({
			override: this.flux.getSlice('Override')
		});
	},
	create: function(req, reply) {
		const override = {
			switchValue: req.payload.switchValue,
			target: req.payload.target,
			reason: req.payload.reason,
			length: req.payload.length
		};

		return this.app.methods.override.create(override, (error, payload) => {
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
		const override = {
			reason: req.payload.reason,
			switchValue: req.payload.switchValue,
			target: req.payload.target,
			length: req.payload.length
		};

		return this.app.methods.override.update(override, (error) => {
			if (!error) {
				return reply({
					msg: 'OK',
					override: this.flux.getSlice('Override')
				}).code(202);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	},
	delete: function(req, reply) {
		return this.app.methods.override.remove((error) => {
			if (!error) {
				return reply({
					override: this.flux.getSlice('Override'),
					msg: 'OK'
				});
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
	]
};
