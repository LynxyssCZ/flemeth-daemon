var Promise = require('bluebird');
var FlemDb = require('../../db');


module.exports = {
	loadFromDB: function() {
		// TODO: Add all stores to rehydrate after implementation
		return Promise.props({
			zones: fetchZones()
		});
	}
};

function fetchZones() {
	return FlemDb.models.Zones.Collection.forge()
		.fetch()
		.then(function(collection) {
			return collection.toJSON();
		});
}
