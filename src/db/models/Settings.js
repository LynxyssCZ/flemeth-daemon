module.exports = function register(Bookshelf) {
	var Setting = Bookshelf.Model.extend({
		tableName: 'settings'
	});

	var Settings = Bookshelf.Collection.extend({
		model: Setting
	});

	return {
		Model: Bookshelf.model('Setting', Setting),
		Collection: Bookshelf.collection('Settings', Settings)
	};
};
