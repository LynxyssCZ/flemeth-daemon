var assign = require('object-assign');


module.exports = {
	create: function(schedule) {
		return [
			{schedules: [assign({id: generateKey()}, schedule)]},
			this.db.getModel('Schedules').forge(schedule).save()
				.then(function(scheduleModel) {
					return {schedules: [scheduleModel.toJSON()]};
				})
		];
	},

	update: function(schedule) {
		return [
			{schedules: [schedule]},
			this.db.getModel('Schedules').forge({id: schedule.id})
			.fetch({required: true})
			.then(function(scheduleModel) {
				return scheduleModel.save(schedule);
			})
			.then(function(scheduleModel) {
				return {
					schedules: [scheduleModel.toJSON()]
				};
			})
		];
	},

	delete: function(scheduleId) {
		return [
			{ deletedSchedules: [scheduleId]},
			this.db.getModel('Schedules').forge({id: scheduleId}).destroy()
			.then(function() {
				return {
					deletedSchedules: [scheduleId]
				};
			})
		];
	}
};


var IntSize = Math.pow(2, 32);


function generateKey() {
	return 'loading_' + (Math.random()*IntSize).toString(16);
}
