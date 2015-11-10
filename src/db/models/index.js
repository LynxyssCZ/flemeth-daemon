module.exports = function register(Bookshelf) {
	return {
		Zones: require('./Zones')(Bookshelf),
		Schedules: require('./Schedules')(Bookshelf),
		Plans: require('./Plans')(Bookshelf),
		Settings: require('./Settings')(Bookshelf),
		SensorsValues: require('./SensorsValues')(Bookshelf),
		ZonesTemps: require('./ZonesTemps')(Bookshelf)
	};
};
