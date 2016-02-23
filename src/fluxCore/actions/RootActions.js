var Promise = require('bluebird');


module.exports = {
	loadFromDB: function() {
		// TODO: Add all stores to rehydrate after implementation
		return Promise.props({
			settings: fetchCollection(this.db, 'Settings'),
			zones: fetchCollection(this.db, 'Zones'),
			schedules: fetchCollection(this.db, 'Schedules')
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
