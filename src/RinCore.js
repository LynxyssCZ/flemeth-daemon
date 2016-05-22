'use strict';
const Async = require('async');
const RinPlugin = require('./RinPlugin');

class RinCore {
	constructor(context) {
		this.db = context.db;
		this.flux = context.flux;
		this.server = context.server;
		this.logger = context.logger;
		this.registeredPlugins = {};
		this.plugins = {};
		this.methods = {};
		this.hooks = {
			'lifecycle.start': [],
			'lifecycle.stop': []
		};

		this.rootPlugin = new RinPlugin(this, '');
	}

	start(next) {
		return this.process('lifecycle.start', null, next);
	}

	stop(next) {
		this.process('lifecycle.stop', null, next);
	}

	process(event, payload, next) {
		if (!this.hooks.hasOwnProperty(event)) {
			return next(null, payload);
		}

		Async.reduce(this.hooks[event], payload, (payload, hook, next) => {
			hook(payload, next);
		}, next);
	}

	register(plugins, next) {
		return this.rootPlugin.register(plugins, next);
	}

	registerStore(key, store) {
		this.flux.addStore(key, store);
	}

	registerTable(name, model, migrationsDir) {
		this.db.registerTable(name, model, migrationsDir);
	}

	addHook(event, handler) {
		if (!this.hooks.hasOwnProperty(event)) {
			this.hooks[event] = new Array();
		}

		this.hooks[event].push(handler);
	}

	addMethod(name, method) {
		const path = name.split('.');
		const length = path.length;

		return path.reduce((stub, key, index) => {
			if (!stub.hasOwnProperty(key)) {
				stub[key] = (index === length - 1) ? method : {};
			}

			return stub[key];
		}, this.methods);
	}

	expose(plugin, key, value) {
		if (!this.plugins.hasOwnProperty(plugin)) {
			this.plugins[plugin] = Object.create(null);
		}

		this.plugins[plugin][key] = value;
	}
}

module.exports = RinCore;
