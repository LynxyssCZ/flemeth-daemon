'use strict';
const actions = require('./SwitcherActions');
const store = require('./SwitcherStore');

class Switcher {
	constructor(app, options) {
		this.app = app;
		this.logger = app.logger.child({component: 'SwitcherManager'});
		this.flux = app.methods.flux;

		this.lockTime = options.lockTime || 5 * 60 * 1000;
		this.unlockTaskId = null;

		this.app.methods.flux.addStore('Switcher', store);

		this.app.addMethod('switcher.switch', this.switch.bind(this));
		this.app.addMethod('switcher.forcedSwitch', this.forcedSwitch.bind(this));
		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));
		this.app.addHook('lifecycle.stop', this.onAppStop.bind(this));

		this.unlock = this.unlock.bind(this);
	}

	switch(value, next) {
		this.logger.debug('Switching to', value);

		this.flux.push(actions.switch, [value, false], (error) => {
			const locked = this.flux.getSlice('Switcher').get('locked');

			if (locked && !this.unlockTaskId) {
				this.setupUnlock();
			}

			if (next) {
				next(error, locked);
			}
		});
	}

	forcedSwitch(value, next) {
		this.logger.debug('Switching to', value);

		this.flux.push(actions.switch, [value, true], (error) => {
			const locked = this.flux.getSlice('Switcher').get('locked');

			if (locked && !this.unlockTaskId) {
				this.setupUnlock();
			}

			if (next) {
				next(error, locked);
			}
		});
	}

	setupUnlock() {
		this.logger.debug('Setting up unlock task in', this.lockTime);
		this.unlockTaskId = global.setTimeout(this.unlock, this.lockTime);
	}

	unlock() {
		this.logger.debug('Unlocking');
		this.flux.push(actions.unlock, [], () => {
			const locked = this.flux.getSlice('Switcher').get('locked');

			if (locked) {
				this.setupUnlock();
			}
			else {
				delete this.unlockTaskId;
				this.logger.debug('Unlocked');
			}
		});
	}

	onAppStart(payload, next) {
		this.forcedSwitch(false, (error) => {
			next(error);
		});
	}

	onAppStop(payload, next) {
		global.setImmediate(next);
	}
}

module.exports = Switcher;
