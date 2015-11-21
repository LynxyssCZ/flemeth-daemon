var OverridesManager = function(options) {
	this.logger = options.logger.child({component: 'OverridesManager'});
	this.container = options.container;

	this.updatePeriod = options.updatePeriod;
	this.updateTaskId = null;
}; OverridesManager.prototype.constructor = OverridesManager;
module.exports = OverridesManager;


OverridesManager.prototype.start = function(next) {
	var self = this;
	this.logger.info('Starting overrides manager');

	this.updateTaskId = global.setInterval(function() {
		self.update();
	}, 5 * 1000);

	next();
};

OverridesManager.prototype.stop = function(next) {
	this.logger.info('Stoping overrides manager');
	global.clearInterval(this.updateTaskId);

	next();
};

OverridesManager.prototype.update = function () {
	var override = this.container.getState('Override');

	if ((override && override.get('created') + (60 * 1000 * override.get('length'))) < Date.now()) {
		this.container.push(this.container.actions.Override.delete, []);
	}
};
