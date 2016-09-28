'use strict';
const actions = require('./ScheduleActions');
const store = require('./ScheduleStore');
const targetStore = require('./ScheduleTargetStore');
const changeModel = require('./ChangeModel');
const ScheduleApi = require('./ScheduleApi');

class ScheduleManager {
	constructor(app, options) {
		this.app = app;
		this.logger = app.logger.child({component: 'ScheduleManager'});
		this.flux = app.methods.flux;

		this.app.addMethod('schedule.insert', this.insertChange.bind(this));
		this.app.addMethod('schedule.remove', this.removeChange.bind(this));
		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));
		this.app.addHook('lifecycle.stop', this.onAppStop.bind(this));

		this.app.methods.flux.addStore('Schedule', store);
		this.app.methods.flux.addStore('ScheduleTarget', targetStore);
		this.app.methods.db.registerModel('Change', changeModel);
		this.app.methods.persistence.add('Change', 'scheduleChanges');
		this.app.methods.api.addEndpoint('schedule', ScheduleApi);

		this.updatePeriod = options.updatePeriod || 5 * 60 * 1000;
		this.updateTaskId = null;
	}

	// Api methods
	insertChange(changeData, next) {
		this.flux.push(actions.insert, [changeData], next);
	}

	removeChange(changeData, next) {
		this.flux.push(actions.delete, [changeData], next);
	}

	// Hooks
	onAppStart(payload, next) {
		this.logger.info('Starting');

		this.subscriptionKey = this.flux.subscribe(this.updateTarget.bind(this), [
			'Schedule', 'Settings'
		]);

		this.updateTaskId = global.setInterval(() => {
			this.updateTarget();
		}, this.updatePeriod);

		global.setImmediate(() => {
			this.updateTarget();
		});

		next();
	}

	onAppStop(payload, next) {
		this.logger.info('Stopping');

		global.clearInterval(this.updateTaskId);
		this.flux.unsubscribe(this.subscriptionKey);

		next();
	}

	updateTarget() {
		const state = this.flux.getSlice(['Schedule', 'Settings', 'ScheduleTarget']);
		const now = new Date();
		const minute = (now.getDay() * 1440) + (now.getHours() * 60 + now.getMinutes());
		const scheduleSettings = state.Settings.get('schedule');
		let defaultTarget;

		if (scheduleSettings) {
			defaultTarget = {
				newTemp: scheduleSettings.get('value').defaultTemp,
				newHyst: scheduleSettings.get('value').defaultHyst
			};
		}
		else {
			defaultTarget = {
				newTemp: 20.5,
				newHyst: 0.5
			};
		}

		if (state.Schedule) {
			const relevantChanges = this.getRelevantChanges(minute, state.Schedule);
			const newTarget = this.getTarget(minute, relevantChanges, defaultTarget);

			if (newTarget.newTemp !== state.ScheduleTarget.get('temperature') || newTarget.newHyst !== state.ScheduleTarget.get('hysteresis')) {
				this.flux.push(actions.changeTarget, [newTarget]);
			}
		}
	}

	getRelevantChanges(minute, schedule) {
		const changes = schedule.toArray();
		const changesCount = changes.length;
		let previousChange, currentChange;

		changes.sort((changeA, changeB) => {
			return changeA.get('startMinute') > changeB.get('startMinute') ? 1 : -1;
		});

		for (let i = 0, change; i < changesCount; i++) {
			change = changes[i];

			if (change.get('startMinute') > minute) {
				break;
			}

			previousChange = currentChange;
			currentChange = change;
		}

		if (currentChange && !previousChange) {
			previousChange = changes[changes.length - 1];
		}

		return {
			previous: previousChange ? previousChange.toJS() : null,
			current: currentChange ? currentChange.toJS() : null
		};
	}

	getTarget(minute, relevantChanges, defaultTarget) {
		const previous = relevantChanges.previous || defaultTarget;
		const current = relevantChanges.current || defaultTarget;
		const target = {
			newTemp: current.newTemp,
			newHyst: current.newHyst
		};

		if (current.startMinute + current.changeLength > minute) {
			const coef = (minute - current.startMinute) / current.changeLength;

			target.newTemp = previous.newTemp + (target.newTemp - previous.newTemp) * coef;
			target.newHyst = previous.newHyst + (target.newHyst - previous.newHyst) * coef;
		}

		return target;
	}
}

module.exports = ScheduleManager;
