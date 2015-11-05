
module.exports = {
	setDefaultPlan: function(planId) {
		//TODO: Store to DB
		return {
			tempchecker: {
				defaultPlan: planId
			}
		};
	}
};
