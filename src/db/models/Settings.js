module.exports = function register(Bookshelf) {
	var Setting = Bookshelf.Model.extend({
		tableName: 'settings',
		hidden: ['raw_value'],
		virtuals: {
			value: {
				get: function() {
					var rawValue = this.get('raw_value');

					if (rawValue) {
						// FIXME: YOLO
						return JSON.parse(rawValue);
					}
					else {
						return [];
					}
				},
				set: function(value) {
					if (value) {
						// FIXME: Double YOLO
						this.set('raw_value', JSON.stringify(value));
					}
					else {
						this.set('raw_value', null);
					}
				}
			}
		}
	});

	var Settings = Bookshelf.Collection.extend({
		model: Setting
	});

	return {
		Model: Bookshelf.model('Setting', Setting),
		Collection: Bookshelf.collection('Settings', Settings)
	};
};
