module.exports = function register(Bookshelf) {
	var Plan = Bookshelf.Model.extend({
		tableName: 'plans',
		virtuals: {
			schedules: {
				get: function() {
					var rawSchedules = this.get('rawSchedules');

					if (rawSchedules) {
						return rawSchedules.split(';');
					}
					else {
						return [];
					}
				},
				set: function(value) {
					if (value) {
						this.set('rawSchedules', value.join(';'));
					}
					else {
						this.set('rawSchedules', null);
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
