'use strict';
const actionTag = require('fluxerino').Utils.actionTag;

const loadFromDB = function loadFromDB(persistentStores) {
	return Promise.all(
		persistentStores.map((store) => {
			return fetchCollection(this.db, store.modelName);
		})
	).then((values) => {
		return values.reduce((values, value, index) => {
			values[persistentStores[index].key] = value;

			return values;
		}, {});
	});
};

actionTag(loadFromDB, 'Flemeth.loadFromDB');

module.exports = {
	loadFromDB: loadFromDB
};

function fetchCollection(db, modelName) {
	return db.getCollection(modelName).forge()
		.fetch()
		.then(function(collection) {
			return collection.toJSON();
		});
}
