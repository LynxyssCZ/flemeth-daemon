'use strict';
const Async = require('async');

class RinPlugin {
	constructor(app, name) {
		this.name = name;
		this.app = app;

		// Properties from app
		Object.assign(this, app.appContext);
		this.plugins = app.plugins;
		this.methods = app.methods;
	}

	getChild(plugin) {
		return new RinPlugin(this.app, plugin);
	}

	register(plugins, next) {
		if (this.app.started) {
			throw new Error('Core is already started');
		}

		this.app.registering = true;
		Async.each(plugins, this._registerPlugin.bind(this), (err) => {
			this.app.registering = false;
			next(err);
		});
	}

	addHook(event, handler) {
		if (!this.app.registering) {
			throw new Error('Adding hooks is allowed only in init phase');
		}

		this.app.addHook(event, handler);
	}

	addMethod(name, method) {
		if (!this.app.registering) {
			throw new Error('Adding methods is allowed only in init phase');
		}

		this.app.addMethod(name, method);
	}

	expose(key, value) {
		if (!this.app.registering) {
			throw new Error('Adding extensions is allowed only in init phase');
		}

		this.app.expose(this.name, key, value);
	}

	_registerPlugin(plugin, next) {
		if (plugin.class && plugin.name) {
			const pluginInstance = new plugin.class(this.getChild(plugin.name), plugin.options);

			this.app.registeredPlugins[plugin.name] = pluginInstance;

			if (pluginInstance.init) {
				pluginInstance.init(next);
			}
			else {
				next();
			}
		}
		else {
			next('Malformed plugin registration');
		}
	}
}

module.exports = RinPlugin;
