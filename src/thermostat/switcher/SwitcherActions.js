'use strict';

module.exports = {
	switch(value, forced) {
		return {
			switcher: {
				value: value,
				forced: forced
			}
		};
	},

	unlock() {
		return {
			switcher: {
				locked: false
			}
		};
	}
};
