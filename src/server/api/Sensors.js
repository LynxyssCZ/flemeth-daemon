var sensorsApi = {
	register: function (server, options, next) {
		next();
	}
};

sensorsApi.register.attributes = {
	name: 'sensors-api',
	version: '1.0.0'
};

module.exports = sensorsApi;
