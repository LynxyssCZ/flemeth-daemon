require('dotenv').load();
var bunyan = require('bunyan');
var Async = require('async');
var FlemethSettings = require('./flemethSettings');
var Flemeth = require('./src');

var log = bunyan.createLogger({name: 'Flemeth', level: process.env.LOG_LEVEL});
var settings = new FlemethSettings({
	logger: log,
	mockGpio: process.env.MOCK_GPIO === 'true'
});

// TODO: Load settings from file or so
var flemeth = new Flemeth(settings.get());

var clear = function() {
	flemeth.stop(function() {
		log.info('Stopped');
		settings.destroy();

		process.exit();
	});
};
process.on('SIGINT', clear);

var start = function() {
	Async.series([
		flemeth.init.bind(flemeth),
		flemeth.start.bind(flemeth)
	], function(error) {
		if (error) {
			log.error(error);
			clear();
		}
		else {
			log.info('Started');
		}
	});
};

start();
