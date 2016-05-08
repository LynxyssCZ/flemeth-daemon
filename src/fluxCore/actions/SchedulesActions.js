module.exports = {
	create: function* createSchedule(schedule) {
		yield {
			schedules: [Object.assign({
				id: generateKey()
			}, schedule)]
		};

		yield this.db.getModel('Schedules').forge(schedule).save()
				.then(function(scheduleModel) {
					return {schedules: [scheduleModel.toJSON()]};
				});
	},

	update: function* updateSchedule(schedule) {
		yield {schedules: [schedule]};

		yield this.db.getModel('Schedules')
			.forge({id: schedule.id})
			.fetch({required: true})
			.then(function(scheduleModel) {
				return scheduleModel.save(schedule);
			})
			.then(function(scheduleModel) {
				return {
					schedules: [scheduleModel.toJSON()]
				};
			});
	},

	delete: function* deleteSchedule(scheduleId) {
		yield {deletedSchedules: [scheduleId]};

		yield this.db.getModel('Schedules')
			.forge({id: scheduleId})
			.destroy()
			.then(function() {
				return {
					deletedSchedules: [scheduleId]
				};
			});
	}
};


var IntSize = Math.pow(2, 32);

function generateKey() {
	return 'loading_' + (Math.random()*IntSize).toString(16);
}
