var SchedulesManager = function(options) {
	this.logger = options.logger.child({component: 'SchedulesManager'});
	this.container = options.container;

	this.updatePeriod = options.updatePeriod;
	this.updateTaskId = null;
}; SchedulesManager.prototype.constructor = SchedulesManager;
module.exports = SchedulesManager;


SchedulesManager.prototype.start = function(next) {
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

	next();
};

SchedulesManager.prototype.stop = function(next) {
	this.logger.info('Stoping schedules manager');
	global.clearInterval(this.updateTaskId);
	this.container.unsubscribe(this.sensorsSubscriptionKey);

	next();
};

SchedulesManager.prototype.getTarget = function (time, schedule) {
	var changes = schedule.get('changes') || [];
	var minute = time.getHours() * 60 + time.getMinutes();

	var relevant = changes.filter(function(change) {
		return change.startTime <= minute;
	}).filter(function(value, index, array) {
		return index >= array.length - 2;
	}).reverse();

	var target = {
		value: schedule.get('startTemp'),
		hysteresis: schedule.get('hysteresis') || 2.0
	};

	if (relevant.length) {// Some relevant changes are left
		target = {
			value: this.getValue(minute, relevant, target.value),
			hysteresis: schedule.get('hysteresis') || 2.0
		};
	}

	return target;
};

SchedulesManager.prototype.getValue = function (minute, relevant, defaultValue) {
	var prevValue = (relevant.length === 2) ? relevant[1].newValue : defaultValue; // Strict 2 items or GTFO
	var value = relevant[0].newValue;

	if (relevant[0].startTime + relevant[0].length > minute) {
		value = prevValue + (value - prevValue)/relevant[0].length * (minute - relevant[0].startTime);
	}

	return value;
};

SchedulesManager.prototype.getCurrentPlan = function (planSettings, plans) {
	if (planSettings) {
		return plans.get(planSettings.get('value').active);
	}
};

SchedulesManager.prototype.update = function () {
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

	this.container.push(this.container.actions.TempChecker.changeTarget, [this.getTarget(now, schedule)]);
};
