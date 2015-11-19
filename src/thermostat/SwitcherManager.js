var Bluebird = require('bluebird');


var SwitcherManager = function(options) {
	this.logger = options.logger.child({ component: 'SwitcherManager' });
	this.container = options.container;
	this.lockTime = options.lockTime;
	this.pin = options.pin;

	this.unlockTask = null;
	this.subKey = null;

	this.unlock = this.unlock.bind(this);
}; SwitcherManager.prototype.constructor = SwitcherManager;

module.exports = SwitcherManager;

SwitcherManager.prototype.start = function (next) {
	this.lock(this.lockTime);
	this.switcher = this.pin;
	return this.switch(false, true, next);
};

SwitcherManager.prototype.stop = function (next) {
	if (this.unlockTask) {
		global.clearTimeout(this.unlockTask);
		this.unlockTask = null;
	}

	return next(null);
};

SwitcherManager.prototype.update = function() {
	var state = this.container.getState(['Switcher', 'TempChecker']);
};

SwitcherManager.prototype.switch = function(value, forced, next) {
	return this.switcher.writeAsync(value)
		.bind(this).then(function() {
			return this.container.push(this.container.action.Switcher.switch, [value, forced], next);
		})
		.catch(function(err) {
			return next(err);
		});
};

SwitcherManager.prototype.lock = function (duration) {
	this.unlockTask = global.setTimeout(this.unlock, duration);
};

SwitcherManager.prototype.unlock = function (next) {
	delete this.unlockTask;
	var state = this.container.getState('Switcher');

	// Value didn't change, only unlock
	if (state.get('nextValue') === state.get('realValue')) {
		return this.container.push(this.container.actions.Switcher.unlock, [], next);
	}
	else {
		// Value changed, do a 'U->S->L' atomically
		return this.switch(state.get('nextValue'), true, next);
	}
};
