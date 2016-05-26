'use strict';
const actions = require('./ScheduleActions');
const store = require('./ScheduleStore');
const changeModel = require('./ChangeModel');
const ScheduleApi = require('./ScheduleApi');

class ScheduleManager {
	constructor(app, options) {
		this.app = app;
		this.logger = app.logger.child({component: 'ScheduleManager'});
		this.flux = app.flux;

		app.addMethod('schedules.create', this.createChange.bind(this));
		app.addMethod('schedules.update', this.updateChange.bind(this));
		app.addMethod('schedules.remove', this.removeChange.bind(this));

		app.flux.addStore('Schedule', store);
		app.db.registerModel('Change', changeModel);
		this.app.methods.api.addEndpoint('schedule', ScheduleApi);

		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));
		this.app.addHook('lifecycle.stop', this.onAppStop.bind(this));

		this.updatePeriod = options.updatePeriod;
		this.updateTaskId = null;
	}

	// Api methods
	createChange(changeData, next) {
		this.flux.push(actions.create, [changeData], next);
	}

	updateChange(changeId, changeData, next) {
		this.flux.push(actions.create, [Object.assign({
			id: changeId
		}, changeData)], next);
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
