module.exports = {
	changeTarget: function(newTarget) {
		return {
			tempChecker: {
				target: newTarget.temp,
				hysteresis: newTarget.hyst
			}
		};
	},
	updateState: function(newState) {
		return {
			tempChecker: {
				state: newState.state,
				rising: newState.rising
			}
		};
	}
};
