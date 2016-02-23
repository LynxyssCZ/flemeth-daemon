module.exports = function register(Bookshelf) {
	return {
		Schedules: require('./Schedules')(Bookshelf),
		Settings: require('./Settings')(Bookshelf),
		Snapshots: require('./Snapshots')(Bookshelf),
		Zones: require('./Zones')(Bookshelf)
	};
};
