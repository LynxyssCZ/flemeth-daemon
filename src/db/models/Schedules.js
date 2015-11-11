module.exports = function register(Bookshelf) {
	var Schedule = Bookshelf.Model.extend({
		tableName: 'schedules',
		hidden: ['raw_changes'],
		virtuals: {
			changes: {
				get: function() {
					var rawChanges = this.get('rawChanges');

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
						this.set('rawChanges', JSON.stringify(value));
					}
					else {
						this.set('rawChanges', null);
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
