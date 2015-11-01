module.exports = function register(Bookshelf) {
	var Schedule = Bookshelf.Model.extend({
		tableName: 'schedules'
	});

	var Schedules = Bookshelf.Collection.extend({
		model: Schedule
	});

	return {
		Model: Bookshelf.model('Schedule', Schedule),
		Collection: Bookshelf.collection('Schedules', Schedules)
	};
};
