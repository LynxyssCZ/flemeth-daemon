const handlers = {
	getRaw: function(req, reply) {
		return reply({
			tempChecker: this.flux.getSlice('TempChecker')
		});
	}
};

module.exports = {
	endpoints: [
		{
			path: '/',
			method: 'GET',
			handler: handlers.getRaw,
			config: {
				description: 'Reads temperature checker value',
				tags: ['api', 'temp-checker']
			}
		}
	]
};
