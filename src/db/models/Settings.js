module.exports = function register(Bookshelf) {
	var Setting = Bookshelf.Model.extend({
		tableName: 'settings',
		hidden: ['id', 'raw_value', 'rawValue'],
		virtuals: {
			value: {
				get: function() {
					var rawValue = this.get('rawValue');

					if (rawValue) {
						// FIXME: YOLO
						return JSON.parse(rawValue);
					}
					else {
						return undefined;
					}
				},
				set: function(value) {
					if (value) {
						// FIXME: Double YOLO
						this.set('rawValue', JSON.stringify(value));
					}
					else {
						this.set('rawValue', null);
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
