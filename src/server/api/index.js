
var api = {
	register: function (server, options, next) {
		server.register([
			{
				register: require('./Override'),
				options: {
					base: options.base.concat('/override')
				}
			}, {
				register: require('./Plans'),
				options: {
					base: options.base.concat('/plans')
				}
			}, {
				register: require('./Root'),
				options: {
					base: options.base.concat('')
				}
			}, {
				register: require('./Sensors'),
				options: {
					base: options.base.concat('/sensors')
				}
			}, {
				register: require('./SensorsValues'),
				options: {
					base: options.base.concat('/sensorsvalues')
				}
			}, {
				register: require('./Settings'),
				options: {
					base: options.base.concat('/settings')
				}
			}, {
				register: require('./Schedules'),
				options: {
					base: options.base.concat('/schedules')
				}
			}, {
				register: require('./Switcher'),
				options: {
					base: options.base.concat('/switcher')
				}
			}, {
				register: require('./TempChecker'),
				options: {
					base: options.base.concat('/tempchecker')
				}
			}, {
				register: require('./Zones'),
				options: {
					base: options.base.concat('/zones')
				}
			}, {
				register: require('./ZonesTemps'),
				options: {
					base: options.base.concat('/zonestemps')
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
