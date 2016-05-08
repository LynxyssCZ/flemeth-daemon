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
	var changes = schedule.get('changes')[time.getDay()] || [];
	var minute = time.getHours() * 60 + time.getMinutes();

	var relevant = changes.filter(function(change) {
		return change.startTime <= minute;
	}).filter(function(value, index, array) {
		return index >= array.length - 2;
	}).reverse();

	var target = {
		temp: schedule.get('startTemp'),
		hyst: schedule.get('startHyst')
	};

	if (relevant.length) {// Some relevant changes are left
		target = this.getValue(minute, relevant, target);
	}

	return target;
};

SchedulesManager.prototype.getValue = function (minute, relevant, baseValue) {
	var prevValue = (relevant.length === 2) ? relevant[1] : baseValue; // Strict 2 items or GTFO
	var value = {
		temp: relevant[0].newTemp,
		hyst: relevant[0].newHyst
	};

	if (relevant[0].startTime + relevant[0].length > minute) {
		var coef = relevant[0].length * (minute - relevant[0].startTime);

		value = {
			temp: prevValue.temp + (value.temp - prevValue.temp)/coef,
			hyst: prevValue.hyst + (value.hyst - prevValue.hyst)/coef
		};
	}

	return value;
};

SchedulesManager.prototype.getCurrentSchedule = function (schedulesSettings, schedules) {
	if (schedulesSettings) {
		return schedules.get(schedulesSettings.get('value').active);
	}
};

SchedulesManager.prototype.update = function () {
	var state = this.container.getSlice(['Schedules', 'Settings', 'TempChecker']),
		now = new Date(),
		currentSchedule = this.getCurrentSchedule(state.Settings.get('schedules'), state.Schedules);

	if (!currentSchedule || !currentSchedule.has('changes')) {
		currentSchedule = state.Schedules.get('default');
	}

	var target = this.getTarget(now, currentSchedule);

	if (target.temp !== state.TempChecker.get('target') || target.hyst !== state.TempChecker.get('hysteresis')) {
		this.container.push(this.container.actions.TempChecker.changeTarget, [target]);
	}
};
