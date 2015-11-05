module.exports = function register(Bookshelf) {
	var SensorValue = Bookshelf.Model.extend({
		tableName: 'sensors_values'
	});

	var SensorsValues = Bookshelf.Collection.extend({
		model: SensorValue,
		hidden: ['raw_meta'],
		virtuals: {
			get: function() {
				var rawMeta = this.get('raw_meta');

				if (rawMeta) {
					// FIXME: YOLO
					return JSON.parse(rawMeta);
				}
				else {
					return [];
				}
			},
			set: function(value) {
				if (value) {
					// FIXME: Double YOLO
					this.set('raw_meta', JSON.stringify(value));
				}
				else {
					this.set('raw_meta', null);
				}
			}
		}
	});

	return {
		Model: Bookshelf.model('SensorValue', SensorValue),
		Collection: Bookshelf.collection('SensorsValues', SensorsValues)
	};
};
