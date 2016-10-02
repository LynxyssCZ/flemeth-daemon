'use strict';
const Joi = require('joi');

const querySchema = Joi.object({
	types: Joi.string().default(''),
	from: Joi.number().integer().positive(),
	to: Joi.number().integer().positive().greater(Joi.ref('from'))
});

const handlers = {
	get(req, reply) {
		const toTs = req.query.to || Date.now();
		const fromTs = req.query.from || toTs - 85800000;
		const types = req.query.types ? req.query.types.split(';') : undefined;

		return this.app.methods.snapshots.read(fromTs, toTs, types, function(err, payload) {
			return reply({
				msg: err ? err : 'Ok',
				snapshots: err ? undefined : payload.snapshots
			});
		});
	}
};

module.exports = {
	endpoints: [
		{
			path: '/',
			method: 'GET',
			handler: handlers.get,
			config: {
				description: 'Reads snapshots from database',
				tags: ['api', 'snapshots'],
				validate: {
					query: querySchema
				}
			}
		}
	]
};
