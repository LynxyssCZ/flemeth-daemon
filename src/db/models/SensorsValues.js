module.exports = function register(Bookshelf) {
	var SensorValue = Bookshelf.Model.extend({
		tableName: 'sensors_values'
	});

	var SensorsValues = Bookshelf.Collection.extend({
		model: SensorValue,
		hidden: ['raw_meta', 'rawMeta'],
		virtuals: {
			get: function() {
				var rawMeta = this.get('rawMeta');

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
					this.set('rawMeta', JSON.stringify(value));
				}
				else {
					this.set('rawMeta', null);
				}
			}
		}
	});

	return {
		Model: Bookshelf.model('SensorValue', SensorValue),
		Collection: Bookshelf.collection('SensorsValues', SensorsValues)
	};
};
