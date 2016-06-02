'use strict';
const Async = require('async');
const RinPlugin = require('./RinPlugin');

class RinCore {
	constructor(context) {
		this.appContext = context || {};
		this.pluginInstances = {};
		this.pluginTree = {};

		this.plugins = {};
		this.methods = {};
		this.hooks = {
			'lifecycle.start': [],
			'lifecycle.stop': []
		};

		this.rootPlugin = new RinPlugin(this, '', context);
		this.rootPlugin.setPluginTreeNode(this.pluginTree);
		Object.assign(this, context);
	}

	getPluginTree() {
		return this.pluginTree;
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
