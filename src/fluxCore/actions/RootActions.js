module.exports = {
	loadFromDB: function loadFromDB() {
		// TODO: Add all stores to rehydrate after implementation
		return Promise.all([
			fetchCollection(this.db, 'Settings'),
			fetchCollection(this.db, 'Zones'),
			fetchCollection(this.db, 'Schedules')
		]).then((values) => {
			return {
				settings: values[0],
				zones: values[1],
				schedules: values[2]
			};
		});
	}
};

function fetchCollection(db, model) {
	return db.getCollection(model).forge()
		.fetch()
		.then(function(collection) {
			return collection.toJSON();
		});
}
