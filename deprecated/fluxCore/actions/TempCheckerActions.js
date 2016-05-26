module.exports = {
	changeTarget: function changeTemperatureTarget(newTarget) {
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
