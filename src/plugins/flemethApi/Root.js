const handlers = {
	getDashboard: function(req, reply) {
		const state = this.flux.getSlice([
			'Override',
			'Switcher',
			'TempChecker',
			'Zones'
		]);

		return reply({
			override: state.Override,
			switcher: state.Switcher,
			tempChecker: state.TempChecker,
			zones: state.Zones.toArray()
		});
	}
};

module.exports = {
	endpoints: [
		{
			path: '/dashboard/',
			method: 'GET',
			handler: handlers.getDashboard,
			config: {
				description: 'Dashboard getter.',
				tags: ['api', 'root']
			}
		}
	]
};
