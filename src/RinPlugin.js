'use strict';
const Async = require('async');

class RinPlugin {
	constructor(app, name, appContext) {
		this.name = name;
		this.app = app;

		// Properties from app
		Object.assign(this, appContext);
		this._appContext = appContext;

		// Exposed stuff
		this.plugins = app.plugins;
		this.methods = app.methods;
	}

	setPluginTreeNode(node) {
		this.pluginTreeNode = node;
	}

	getPluginTreeNode() {
		return this.pluginTreeNode;
	}

	createChild(pluginName) {
		const childPlugin = new RinPlugin(this.app, pluginName, this._appContext);
		const childNode = {
			name: pluginName
		};

		if (this.pluginTreeNode.children) {
			this.pluginTreeNode.children.push(childNode);
		}
		else {
			this.pluginTreeNode.children = [childNode];
		}

		childPlugin.setPluginTreeNode(childNode);

		return childPlugin;
	}

	register(plugins, next) {
		if (this.app.started) {
			throw new Error('Core is already started');
		}

		this.app.registering = true;
		Async.each(plugins, this._registerPlugin.bind(this), (err) => {
			this.app.registering = false;
			this.app.currentNode = undefined;
			next(err);
		});
	}

	mergeContext(newContext) {
		this._appContext = Object.assign({}, this._appContext, newContext);
		Object.assign(this, this._appContext);
		this.pluginTreeNode.extendsContext = true;
	}

	process(event, payload, next) {
		return this.app.process(event, payload, next);
	}

	addHook(event, handler) {
		if (!this.app.registering) {
			throw new Error('Adding hooks is allowed only in init phase');
		}

		this.app.addHook(event, handler, this.name);
		this._logExtension('hook', event);
	}

	addMethod(name, method) {
		if (!this.app.registering) {
			throw new Error('Adding methods is allowed only in init phase');
		}

		this.app.addMethod(name, method, this.name);
		this._logExtension('method', name);
	}

	expose(key, value) {
		if (!this.app.registering) {
			throw new Error('Adding extensions is allowed only in init phase');
		}

		this.app.expose(this.name, key, value);
		this._logExtension('value', key);
	}

	logExtensionUsage(type, value) {
		if (!this.app.registering) {
			throw new Error('Extensing other plugins is allowed only in init phase');
		}

		const extension = {
			time: Date.now(),
			provider: this.name,
			type: type,
			value: value
		};

		if (this.app.currentNode.extensions) {
			this.app.currentNode.extensions.push(extension);
		}
		else {
			this.app.currentNode.extensions = [extension];
		}
	}

	_registerPlugin(plugin, next) {
		if (this.app.pluginInstances[plugin.name]) {
			throw new Error('Registering plugins multiple times is not supported');
		}

		if (plugin.class && plugin.name) {
			const child = this.createChild(plugin.name);
			this.app.currentNode = child.getPluginTreeNode();

			const pluginInstance = new plugin.class(child, plugin.options || {});
			this.app.pluginInstances[plugin.name] = pluginInstance;

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

	_logExtension(type, value) {
		const extension = {
			time: Date.now(),
			type: type,
			value: value
		};

		if (this.pluginTreeNode.extensions) {
			this.pluginTreeNode.extensions.push(extension);
		}
		else {
			this.pluginTreeNode.extensions = [extension];
		}
	}
}

module.exports = RinPlugin;
