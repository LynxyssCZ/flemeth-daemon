module.exports = function register(Bookshelf) {
	return {
		Plans: require('./Plans')(Bookshelf),
		Schedules: require('./Schedules')(Bookshelf),
		SensorsValues: require('./SensorsValues')(Bookshelf),
		Settings: require('./Settings')(Bookshelf),
		Zones: require('./Zones')(Bookshelf),
		ZonesTemps: require('./ZonesTemps')(Bookshelf)
	};
};
