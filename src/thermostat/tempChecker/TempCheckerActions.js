'use strict';

module.exports = {
	updateState(satisfied, rising) {
		return {
			tempChecker: {
				state: satisfied,
				rising: rising
			}
		};
	}
};
