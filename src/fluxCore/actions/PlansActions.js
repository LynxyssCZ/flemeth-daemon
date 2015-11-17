var assign = require('object-assign');


module.exports = {
	create: function(plan) {
		return [
			{plans: [assign({id: generateKey()}, plan)]},
			this.db.getModel('Plans').forge(plan).save()
				.then(function(planModel) {
					return {plans: [planModel.toJSON()]};
				})
		];
	},

	update: function(plan) {
		return [
			{plans: [plan]},
			this.db.getModel('Plans').forge({id: plan.id})
			.fetch({required: true})
			.then(function(planModel) {
				return planModel.save(plan);
			})
			.then(function(planModel) {
				return {
					plans: [planModel.toJSON()]
				};
			})
		];
	},

	delete: function(planId) {
		return [
			{ deletedPlans: [planId]},
			this.db.getModel('Plans').forge({id: planId}).destroy()
			.then(function() {
				return {
					deletedPlans: [planId]
				};
			})
		];
	}
};


var IntSize = Math.pow(2, 32);


function generateKey() {
	return 'loading_' + (Math.random()*IntSize).toString(16);
}
