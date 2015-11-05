module.exports = function register(Bookshelf) {
	var Plan = Bookshelf.Model.extend({
		tableName: 'plans',
		virtuals: {
			schedules: {
				get: function() {
					var rawSchedules = this.get('raw_schedules');

					if (rawSchedules) {
						return rawSchedules.split(';');
					}
					else {
						return [];
					}
				},
				set: function(value) {
					if (value) {
						this.set('raw_schedules', value.join(';'));
					}
					else {
						this.set('raw_schedules', null);
					}
				}
			}
		}
	});

	var Plans = Bookshelf.Collection.extend({
		model: Plan
	});

	return {
		Model: Bookshelf.model('Plan', Plan),
		Collection: Bookshelf.collection('Plans', Plans)
	};
};
