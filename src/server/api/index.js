
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
			}
		], function(err) {
			next(err);
		});
	}
};

var swaggerSpecs = {
	tags: [
		{
			name: 'zones',
			description: 'Full zones CRUD'
		},
		{
			name: 'sensors',
			description: 'Sensors *read-only* endpoints'
		}
	]
};

api.register.attributes = {
	name: 'api',
	version: '1.0.0',
	swaggerSpecs: swaggerSpecs
};

module.exports = api;
