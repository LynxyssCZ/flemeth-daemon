function composeStores(stores) {
	return function CompositeStore(action, state) {
		return Object.keys(stores).reduce(function(result, key) {
			result[key] = stores[key](action, state[key]);
			return result;
		}, {});
	};
}

module.exports = {
	stores: {
		Sensors: require('./SensorsStore'),
	},
	compose: composeStores
};
