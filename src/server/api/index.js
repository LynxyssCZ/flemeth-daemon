
var api = {
	register: function (server, options, next) {
		server.register([
			{
				register: require('./Sensors'),
				options: {
					base: options.base.concat('/sensors')
				}
			}, {
				register: require('./zones'),
				options: {
					base: options.base.concat('/zones')
				}
			}
		], function(err) {
			next(err);
		});
	}
};

api.register.attributes = {
	name: 'api',
	version: '1.0.0'
};

module.exports = api;
