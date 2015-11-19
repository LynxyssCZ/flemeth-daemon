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

	var value = state.TempChecker.get('state');
	var realValue = state.Switcher.get('realValue');
	var nextValue = state.Switcher.get('nextValue');

	if (value === nextValue && value === realValue) {
		return;
	}

	this.logger.debug('Switching');
	if (state.get('locked') === false) {
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
			return this.container.push(this.container.action.Switcher.switch, [value, forced], next);
		})
		.catch(function(err) {
			return next(err);
		});
};

SwitcherManager.prototype.changeNext = function (value, next) {
	this.logger.debug('Changing next value', value);
	return this.container.push(this.container.action.Switcher.switch, [value, false], next);
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
