module.exports = {
	create: function createOverride(override) {
		return {
			override: Object.assign({
				created: Date.now()
			}, override)
		};
	},

	update: function updateOverride(override) {
		return {
			override: override
		};
	},

	delete: function deleteOverride() {
		return {};
	}
};
