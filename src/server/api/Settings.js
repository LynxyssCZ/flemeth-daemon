var Joi = require('joi');

var SettingKeySchema = Joi.string().min(5).max(50).required();
var SettingValueSchema = Joi.object().required();

var settingsApi = {
	register: function (server, options, next) {
		var routes = endpoints.map(function(route) {
			route.path = options.base.concat(route.path);
			return route;
		});
		server.route(routes);
		next();
	}
};

settingsApi.register.attributes = {
	name: 'settings-api',
	version: '1.0.0'
};

module.exports = settingsApi;

var handlers = {
	getRaw: function(req, reply) {
		return reply({
			settings: req.server.app.container.getState('Settings')
		});
	},
	update: function(req, reply) {
		var container = req.server.app.container;
		var settingKey = req.params.settingKey;

		var setting = {
			key: settingKey,
			value: req.payload
		};

		return container.push(container.actions.Settings.update, [setting], function(error, payload) {
			return reply({
				msg: error ? error : 'OK',
				settings: error ? undefined : payload.settings
			});
		});
	},
	delete: function(req, reply) {
		var container = req.server.app.container;
		var settingKey = req.params.settingKey;

		container.push(container.actions.Settings.delete, [settingKey], function(err) {
			return reply({
				msg: err ? err : 'Ok'
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
			description: 'Base settings getter.',
			notes: ['Returns all', 'No filtering', 'Raw from core'],
			tags: ['api', 'settings']
		}
	},
	{
		path: '/{settingKey}',
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
		path: '/{settingKey}',
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
];
