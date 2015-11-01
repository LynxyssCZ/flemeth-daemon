module.exports = function register(Bookshelf) {
	var SensorValue = Bookshelf.Model.extend({
		tableName: 'sensors_values'
	});

	var SensorsValues = Bookshelf.Collection.extend({
		model: SensorValue
	});

	return {
		Model: Bookshelf.model('SensorValue', SensorValue),
		Collection: Bookshelf.collection('SensorsValues', SensorsValues)
	};
};
