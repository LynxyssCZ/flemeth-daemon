var SchedulesManager = function(options) {
	this.logger = options.logger.child({component: 'SchedulesManager'});
	this.container = options.container;

	this.updatePeriod = options.updatePeriod;
	this.updateTaskId = null;
}; SchedulesManager.prototype.constructor = SchedulesManager;
module.exports = SchedulesManager;


SchedulesManager.prototype.start = function() {
	var self = this;
	this.logger.info('Starting schedules manager');
	this.sensorsSubscriptionKey = this.container.subscribe([
		'Schedules', 'Plans', 'Settings'
	], this.update.bind(this));

	this.updateTaskId = global.setInterval(function() {
		self.update();
	}, this.updatePeriod);

	global.setTimeout(function() {
		self.update();
	});
};

SchedulesManager.prototype.stop = function() {
	this.logger.info('Stoping schedules manager');
	global.clearInterval(this.updateTaskId);
	this.container.unsubscribe(this.sensorsSubscriptionKey);
};

SchedulesManager.prototype.getTarget = function (time, schedule) {
	var changes = schedule.get('changes');
	var minute = time.getHours() * 60 + time.getMinutes();

	var target = {
		value: schedule.get('startTemp'),
		hysteresis: schedule.get('hysteresis') || 2.0
	};

	if (changes && changes.length) {
		target = changes.filter(function(change) {
			return change.startTime <= minute;
		}).reduce(function(oldTarget, change) {
			return {
				value: change.newValue || oldTarget.value,
				hysteresis: change.hysteresis || oldTarget.hysteresis
			};
		}, target);
	}

	return target;
};

SchedulesManager.prototype.getCurrentPlan = function (planSettings, plans) {
	if (planSettings) {
		return plans.get(planSettings.get('value').active);
	}
};

SchedulesManager.prototype.update = function () {
	this.logger.debug('Update');

	var state = this.container.getState(['Schedules', 'Plans', 'Settings']),
		now = new Date(),
		currentPlan = this.getCurrentPlan(state.Settings.get('plans'), state.Plans),
		schedule;

	if (currentPlan && currentPlan.has('schedules')) {
		schedule = state.Schedules.get(currentPlan.get('schedules')[now.getDay()]) || state.Schedules.get('default');
	}
	else {
		schedule = state.Schedules.get('default');
	}

	var target = this.getTarget(now, schedule);
	this.logger.debug('Target', target);
};