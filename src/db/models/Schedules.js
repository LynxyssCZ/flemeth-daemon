module.exports = function register(Bookshelf) {
	var Schedule = Bookshelf.Model.extend({
		tableName: 'schedules',
		hidden: ['raw_changes'],
		virtuals: {
			changes: {
				get: function() {
					var rawChanges = this.get('raw_changes');

					if (rawChanges) {
						// FIXME: YOLO
						return JSON.parse(rawChanges);
					}
					else {
						return [];
					}
				},
				set: function(value) {
					if (value) {
						// FIXME: Double YOLO
						this.set('raw_changes', JSON.stringify(value));
					}
					else {
						this.set('raw_changes', null);
					}
				}
			}
		}
	});

	var Schedules = Bookshelf.Collection.extend({
		model: Schedule
	});

	return {
		Model: Bookshelf.model('Schedule', Schedule),
		Collection: Bookshelf.collection('Schedules', Schedules)
	};
};
