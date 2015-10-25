var ZonesManager = function(options) {
	this.logger = options.logger.child({component: 'ZonesManager'});
	this.container = options.container;
	this.actions = options.actions;
}; ZonesManager.prototype.constructor = ZonesManager;
module.exports = ZonesManager;


ZonesManager.prototype.start = function() {
	this.logger.info('Starting zones manager');
	this.subscriptionKey = this.container.subscribe([
		'Sensors', 'Zones'
	], this.updateZones.bind(this));
};

ZonesManager.prototype.stop = function() {
	this.logger.info('Stoping zones manager');
	this.container.unsubscribe(this.subscriptionKey);
};

ZonesManager.prototype.updateZones = function () {
	var state = this.container.getState(['Zones', 'Sensors']);

	this.logger.info(state, 'Update of sensors');
};
