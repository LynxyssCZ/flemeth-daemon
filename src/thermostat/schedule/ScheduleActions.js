'use strict';

module.exports = {
	* insert(change) {
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

	* delete(change) {
		yield {scheduleChanges: [
			Object.assign({ deleting: true }, change)
		]};

		const Change = this.app.methods.db.getModel('Change');

		yield Change.forge().where({day: change.day, start_time: change.startTime}).destroy()
			.then(function() {
				return {
					deletedScheduleChanges: [change]
				};
			});
	},

	changeTarget(newTarget) {
		return { scheduleTarget: {
			temperature: newTarget.newTemp,
			hysteresis: newTarget.newHyst
		}};
	}
};
