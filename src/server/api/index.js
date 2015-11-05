
var api = {
	register: function (server, options, next) {
		server.register([
			{
				register: require('./Sensors'),
				options: {
					base: options.base.concat('/sensors')
				}
			}, {
				register: require('./Zones'),
				options: {
					base: options.base.concat('/zones')
				}
			}, {
				register: require('./Switcher'),
				options: {
					base: options.base.concat('/switcher')
				}
			}, {
				register: require('./Schedules'),
				options: {
					base: options.base.concat('/schedules')
				}
			}, {
				register: require('./Plans'),
				options: {
					base: options.base.concat('/plans')
				}
			}
		], function(err) {
			next(err);
		});
	}
};

var swaggerSpecs = {
	tags: []
};

api.register.attributes = {
	name: 'api',
	version: '1.0.0',
	swaggerSpecs: swaggerSpecs
};

module.exports = api;
