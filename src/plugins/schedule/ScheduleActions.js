module.exports = {
	create: function* createChange(change) {
		yield {
			changes: [Object.assign({
				id: generateKey()
			}, change)]
		};

		yield this.db.getModel('Change').forge(change).save()
				.then(function(scheduleModel) {
					return {changes: [scheduleModel.toJSON()]};
				});
	},

	update: function* updateChange(change) {
		yield {changes: [change]};

		yield this.db.getModel('Change')
			.forge({id: change.id})
			.fetch({required: true})
			.then(function(scheduleModel) {
				return scheduleModel.save(change);
			})
			.then(function(scheduleModel) {
				return {
					changes: [scheduleModel.toJSON()]
				};
			});
	},

	delete: function* deleteChange(changeId) {
		yield {deletedChanges: [changeId]};

		yield this.db.getModel('Change')
			.forge({id: changeId})
			.destroy()
			.then(function() {
				return {
					deletedChanges: [changeId]
				};
			});
	}
};


var IntSize = Math.pow(2, 32);

function generateKey() {
	return 'loading_' + (Math.random()*IntSize).toString(16);
}
