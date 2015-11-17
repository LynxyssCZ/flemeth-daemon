module.exports = {
	changeTarget: function(newTarget) {
		return {
			tempChecker: {
				target: newTarget.value,
				hysteresis: newTarget.hysteresis
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
