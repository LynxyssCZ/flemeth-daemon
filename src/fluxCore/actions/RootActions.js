var Promise = require('bluebird');


module.exports = {
	loadFromDB: function() {
		// TODO: Add all stores to rehydrate after implementation
		return Promise.props({
			settings: fetchSettings(this.db),
			zones: fetchZones(this.db)
		});
	}
};

function fetchZones(db) {
	return db.getCollection('Zones').forge()
		.fetch()
		.then(function(collection) {
			return collection.toJSON();
		});
}

function fetchSettings(db) {
	return db.getCollection('Settings').forge()
		.fetch()
		.then(function(collection) {
			return collection.toJSON();
		});
}
