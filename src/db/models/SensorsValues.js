module.exports = function register(Bookshelf) {
	var SensorValue = Bookshelf.Model.extend({
		tableName: 'sensors_values',
		hidden: ['raw_meta', 'rawMeta'],
		virtuals: {
			meta: {
				get: function() {
					var rawMeta = this.get('rawMeta');

					if (rawMeta) {
						// FIXME: YOLO
						return JSON.parse(rawMeta);
					}
					else {
						return undefined;
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
		}
	});

	var SensorsValues = Bookshelf.Collection.extend({
		model: SensorValue
	});

	return {
		Model: Bookshelf.model('SensorValue', SensorValue),
		Collection: Bookshelf.collection('SensorsValues', SensorsValues)
	};
};
