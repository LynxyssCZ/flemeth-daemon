function FluxContainer(compositeStore) {
	this.compositeStore = compositeStore;
	this.dispatch = this.dispatch.bind(this);
	this.getState = this.getState.bind(this);

	this.dispatchInProgress = false;
	this.actionQueue = [];
	this.dataStore = {};

	this.subscriptions = {};
}

FluxContainer.prototype.getState = function(keys) {
	var state = this.dataStore;

	if (Array.isArray(keys)) {
		return keys.reduce(function(result, key) {
			var atom = {};

			if (key in state) {
				atom = state[key];
			}
			result[key] = atom;

			return result;
		}, {});
	}
	else {
		return state[keys];
	}
};

FluxContainer.prototype.dispatch = function(actions) {
	if (!actions || actions.length === 0) {
		return;
	}

	var newState = this.dataStore;

	while(actions.length > 0) {
		newState = this.compositeStore(
			actions.shift(),
			newState
		);
	}

	var changes = findChanges(this.dataStore, newState);
	if (changes.length > 0) {
		this.dataStore = newState;
		this.notifySubscribers(changes, newState);
	}
	this.dispatchInProgress = false;
};

FluxContainer.prototype.notifySubscribers = function(changes) {
	for (var subKey in this.subscriptions) {
		var sub = this.subscriptions[subKey];

		if (hasIntersection(sub.subscriptions, changes)) {
			sub.callback();
		}
	}
};

/**
 * @param  Array<String> Array of store keys to be subscribed
 * @param  Function Callback executed every time one or more of subscibed stores update
 * @return Key
 */
FluxContainer.prototype.subscribe = function(stores, callback) {
	var key = generateKey();

	// Chain the keys to avoid duplicates (highly unlikely)
	while (key in this.subscriptions) {
		key = key.concat('-').concat(generateKey());
	}

	this.subscriptions[key] = {
		callback: callback,
		subscriptions: stores
	};

	return key;
};

/**
 * @param  Function Callback to be unsubscribed
 */
FluxContainer.prototype.unsubscribe = function(key) {
	if (key in this.subscriptions) {
		delete this.subscriptions[key];
	}
};

var IntSize = Math.pow(2, 32);

function generateKey() {
	return (Math.random()*IntSize).toString(16);
}

function hasIntersection(arrayA, arrayB) {
	return arrayA.some(function(item) {
		return arrayB.indexOf(item) >= 0;
	});
}

function findChanges(stateB, stateA) {
	return Object.keys(stateA).reduce(function(changes, key) {
		if (stateA[key] !== stateB[key]) {
			changes.push(key);
		}
		return changes;
	}, []);
}

module.exports = FluxContainer;
