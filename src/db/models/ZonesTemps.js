module.exports = function register(Bookshelf) {
	var ZoneTemp = Bookshelf.Model.extend({
		tableName: 'zones_temps'
	});

	var ZonesTemps = Bookshelf.Collection.extend({
		model: ZoneTemp
	});

	return {
		Model: Bookshelf.model('ZoneTemp', ZoneTemp),
		Collection: Bookshelf.collection('ZonesTemps', ZonesTemps)
	};
};
