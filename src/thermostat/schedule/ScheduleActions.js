module.exports = {
	insert: function* insertChange(change) {
		yield {
			scheduleChanges: [change]
		};

		const ChangeModel = this.app.methods.db.getModel('Change');

		yield ChangeModel.forge({day: change.day, startTime: change.startTime})
			.fetch({ require: true })
			.then(function(changeModel) {
				return changeModel.save(change);
			})
			.catch(function() {
				return new ChangeModel(change).save();
			})
			.then(function(changeModel) {
				return {scheduleChanges: [changeModel.toJSON()]};
			});
	},

	delete: function* deleteChange(change) {
		yield {scheduleChanges: [change]};

		yield this.app.methods.db.getModel('Change')
			.where({day: change.day, startTime: change.startTime})
			.destroy()
			.then(function() {
				return {
					deletedScheduleChanges: [change]
				};
			});
	}
};
