'use strict';

module.exports = {
	createSwitchOverride(value, reason, length) {
		return {
			override: {
				switchValue: value,
				reason: reason,
				length: length,
				created: Date.now()
			}
		};
	},
	createTargetOverride(value, reason, length) {
		return {
			override: {
				target: value,
				reason: reason,
				length: length,
				created: Date.now()
			}
		};
	},
	update(target, switchValue, reason, length) {
		return {
			override: {
				target: target,
				switchValue: switchValue,
				reason: reason,
				length: length
			}
		};
	},
	remove() {
		return {};
	}
};
