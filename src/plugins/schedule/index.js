'use strict';
const actions = require('./ScheduleActions');
const store = require('./ScheduleStore');
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
		this.app.methods.db.registerModel('Change', changeModel);
		this.app.methods.core.addPersistance('Change', 'scheduleChanges');
		this.app.methods.api.addEndpoint('schedule', ScheduleApi);

		this.updatePeriod = options.updatePeriod;
		this.updateTaskId = null;
	}

	// Api methods
	insertChange(changeData, next) {
		this.flux.push(actions.insert, [changeData], next);
	}

	removeChange(changeId, next) {
		this.flux.push(actions.delete, [changeId], next);
	}

	// Hooks
	onAppStart(payload, next) {
		this.logger.info('Starting');

		next();
	}

	onAppStop(payload, next) {
		this.logger.info('Stopping');

		next();
	}

	updateTarget() {

	}
}

module.exports = ScheduleManager;
