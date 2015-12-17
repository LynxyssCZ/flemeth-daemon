module.exports = function register(Bookshelf) {
	var Snapshot = Bookshelf.Model.extend({
		tableName: 'snapshots',
		hidden: ['id', 'raw_data', 'rawData'],
		virtuals: {
			data: {
				get: function() {
					var rawData = this.get('rawData');

					if (rawData) {
						return JSON.parse(rawData);
					}
					else {
						return undefined;
					}
				},
				set: function(data) {
					if (data) {
						this.set('rawData', JSON.stringify(data));
					}
					else {
						this.set('rawData', null);
					}
				}
			}
		}
	});

	var Snapshots = Bookshelf.Collection.extend({
		model: Snapshot
	});

	return {
		Model: Bookshelf.model('Snapshot', Snapshot),
		Collection: Bookshelf.collection('Snapshots', Snapshots)
	};
};
