var Promise = require('bluebird');
var FlemDb = require('../../db');


module.exports = {
	loadFromDB: function() {
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
