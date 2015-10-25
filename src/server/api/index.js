var api = {
	register: function (server, options, next) {
		server.register([
			{
				register: require('./Sensors')
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
