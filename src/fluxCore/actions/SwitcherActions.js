module.exports = {
	switch: function(nextValue, forced) {
		return {
			switcher: {
				forced: forced,
				nextValue: nextValue
			}
		};
	},

	lock: function() {
		return {
			switcher: {
				locked: true
			}
		};
	},

	unlock: function() {
		return {
			switcher: {
				locked: false
			}
		};
	}
};
