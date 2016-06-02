'use strict';
const Joi = require('joi');
const Boom = require('boom');

const SettingKeySchema = Joi.string().min(5).max(50).required();
const SettingValueSchema = Joi.object().required();

const handlers = {
	getRaw: function(req, reply) {
		return reply({
			settings: this.flux.getSlice('Settings').toArray()
		});
	},
	update: function(req, reply) {
		return  this.app.methods.settings.set({
			key: req.params.settingKey,
			value: req.payload
		}, function(error, payload) {
			if (!error) {
				return reply({
					msg: 'OK',
					settings: payload.settings
				}).code(202);
			}
			else {
				return reply(Boom.wrap(error, 500));
			}
		});
	},
	delete: function(req, reply) {
		this.app.methods.settings.remove(req.params.settingKey, function(error) {
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

module.exports = {
	endpoints: [
		{
			path: '/',
			method: 'GET',
			handler: handlers.getRaw,
			config: {
				description: 'Base settings getter.',
				notes: ['Returns all', 'No filtering', 'Raw from core'],
				tags: ['api', 'settings']
			}
		},
		{
			path: '/{settingKey}/',
			method: 'PUT',
			handler: handlers.update,
			config: {
				description: 'Update/Create a setting',
				tags: ['api', 'settings'],
				validate: {
					params: {
						settingKey: SettingKeySchema
					},
					payload: SettingValueSchema
				}
			}
		},
		{
			path: '/{settingKey}/',
			method: 'DELETE',
			handler: handlers.delete,
			config: {
				description: 'Delete setting from system',
				tags: ['api', 'settings'],
				validate: {
					params: {
						settingKey: SettingKeySchema
					}
				}
			}
		}
	]
};
