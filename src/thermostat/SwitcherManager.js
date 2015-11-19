var SwitcherManager = function(options) {
	this.logger = options.logger.child({ component: 'SwitcherManager' });
	this.container = options.container;
	this.lockTime = options.lockTime;
	this.switcher = options.pin;

	this.unlockTask = null;
	this.subKey = null;

	this.unlock = this.unlock.bind(this);
}; SwitcherManager.prototype.constructor = SwitcherManager;

module.exports = SwitcherManager;

SwitcherManager.prototype.start = function (next) {
	var self = this;

	this.sensorsSubscriptionKey = this.container.subscribe([
		'TempChecker'
	], this.update.bind(this));

	this.switch(false, true, function(error) {
		self.setupUnlock(self.lockTime);
		self.update();

		if (next) {
			next(error);
		}
	});
};

SwitcherManager.prototype.stop = function (next) {
	if (this.unlockTask) {
		global.clearTimeout(this.unlockTask);
		this.unlockTask = null;
	}
	this.container.unsubscribe(this.sensorsSubscriptionKey);
	// Cleanup
	return next(null);
};

SwitcherManager.prototype.update = function() {
	var state = this.container.getState(['Switcher', 'TempChecker']);
	this.logger.debug('Switcher update');

	var value = state.TempChecker.get('state');
	var locked = state.Switcher.get('locked');
	var realValue = state.Switcher.get('realValue');
	var nextValue = state.Switcher.get('nextValue');

	if (value === nextValue && value === realValue) {
		this.logger.debug('Skipping switching');
		return;
	}

	this.logger.debug('Switching');
	if (locked === false) {
		this.setupUnlock(this.lockTime);
		return this.switch(value);
	}
	else {
		return this.changeNext(value);
	}
};

SwitcherManager.prototype.switch = function(value, forced, next) {
	this.logger.debug('Changing "real" value', value);
	return this.switcher.writeAsync(value)
		.bind(this).then(function() {
			return this.container.push(this.container.actions.Switcher.switch, [value, forced], next);
		})
		.catch(function(err) {
			return next ? next(err) : undefined;
		});
};

SwitcherManager.prototype.changeNext = function (value, next) {
	this.logger.debug('Changing next value', value);
	return this.container.push(this.container.actions.Switcher.switch, [value, false], next);
};

SwitcherManager.prototype.setupUnlock = function (duration) {
	this.logger.debug('Setting up unlock task');
	this.unlockTask = global.setTimeout(this.unlock, duration);
};

SwitcherManager.prototype.unlock = function (next) {
	delete this.unlockTask;
	var state = this.container.getState('Switcher');

	// Value didn't change, only unlock
	if (state.get('nextValue') === state.get('realValue')) {
		this.logger.debug('Unlocking switcher');
		return this.container.push(this.container.actions.Switcher.unlock, [], next);
	}
	else {
		// Value changed, do a 'U->S->L' atomically
		this.logger.debug('Changing value, re-locking');
		return this.switch(state.get('nextValue'), true, next);
	}
};
