var assign = require('object-assign');

module.exports = {
	create: function(override) {
		return {
			override: assign({
				created: Date.now()
			}, override)
		};
	},

	update: function(override) {
		return {
			override: override
		};
	},

	delete: function() {
		return {};
	}
};
