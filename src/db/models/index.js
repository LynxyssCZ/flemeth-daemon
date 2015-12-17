module.exports = function register(Bookshelf) {
	return {
		Plans: require('./Plans')(Bookshelf),
		Schedules: require('./Schedules')(Bookshelf),
		Settings: require('./Settings')(Bookshelf),
		Snapshots: require('./Snapshots')(Bookshelf),
		Zones: require('./Zones')(Bookshelf)
	};
};
