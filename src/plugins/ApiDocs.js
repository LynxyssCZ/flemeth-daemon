class ApiDocs {
	constructor(app, options) {
		this.app = app;
		this.logger = app.logger.child({component: 'ApiDocs'});
		this.options = options;
	}

	init(next) {
		this.logger.info('Initializing');
		this.app.server.register([
			require('vision'),
			require('inert'),
			{
				register: require('hapi-swaggered'),
				options: {
					endpoint: '/swag-spec',
					stripPrefix: this.options.apiPrefix,
					tags: this.options.apiTags,
					info: {
						title: 'Flemeth daemon',
						description: 'Javascript based home thermostat',
						version: this.options.apiVersion
					}
				}
			},
			{
				register: require('hapi-swaggered-ui'),
				options: {
					title: 'Flemeth API Documentation',
					path: '/swag-doc',
					swaggerOptions: {
						validatorUrl: null
					},
					authorization: false
				}
			}
		], next);
	}
}

module.exports = ApiDocs;
