var Promise = require('bluebird');
var path = require('path');
var DataStore = require('nedb');

Promise.promisifyAll(DataStore.prototype);

var db = module.exports.db = {};

module.exports.config = function(options) {
	db.zones = new DataStore({ filename: path.join(options.nedbPath, 'zones.db'), autoload: true });
	db.schedules = new DataStore({ filename: path.join(options.nedbPath, 'schedules.db'), autoload: true });
};
