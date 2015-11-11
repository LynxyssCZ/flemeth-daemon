module.exports = function register(Bookshelf) {
	var Zone = Bookshelf.Model.extend({
		tableName: 'zones',
		hidden: ['raw_sensors', 'rawSensors'],
		virtuals: {
			sensors: {
				get: function() {
					var rawSensors = this.get('rawSensors');

					if (rawSensors) {
						return rawSensors.split(';');
					}
					else {
						return [];
					}
				},
				set: function(value) {
					if (value) {
						this.set('rawSensors', value.join(';'));
					}
					else {
						this.set('rawSensors', null);
					}
				}
			}
		}
	});

	var Zones = Bookshelf.Collection.extend({
		model: Zone
	});

	return {
		Model: Bookshelf.model('Zone', Zone),
		Collection: Bookshelf.collection('Zones', Zones)
	};
};
