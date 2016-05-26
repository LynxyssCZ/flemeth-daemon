module.exports = {
	switch: function toggleSwitcher(nextValue, forced) {
		return {
			switcher: {
				forced: forced,
				nextValue: nextValue
			}
		};
	},

	lock: function lockSwitcher() {
		return {
			switcher: {
				locked: true
			}
		};
	},

	unlock: function unlockSwitcher() {
		return {
			switcher: {
				locked: false
			}
		};
	}
};
