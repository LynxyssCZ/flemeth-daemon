'use strict';
require('dotenv').load();

const bunyan = require('bunyan');
const Async = require('async');

const FlemethSettings = require('./flemethSettings');
const Flemeth = require('./src');

const log = bunyan.createLogger({name: 'Flemeth', level: process.env.LOG_LEVEL});
const settings = new FlemethSettings({
	logger: log
});

const flemeth = new Flemeth(settings.get());

const clear = function() {
	flemeth.stop(function() {
		log.info('All Stopped');
		log.info('The way is clear, Flemeth is exiting.');
		process.exit();
	});
};

const start = function() {
	Async.series([
		flemeth.init.bind(flemeth),
		flemeth.start.bind(flemeth)
	], function(error) {
		if (error) {
			log.error(error);
			clear();
		}
		else {
			log.info('All Started');
		}
	});
};

process.on('SIGINT', clear);
process.on('uncaughtException', function (err) {
	log.error('Some unexpected error occured', err);
	log.error(err.stack);
	clear();
});

start();
