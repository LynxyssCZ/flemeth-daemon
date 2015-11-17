var Map = require('immutable').Map;
var RootActions = require('../actions').Root;
var PlansActions = require('../actions').Plans;


function PlansStore(type, payload, state) {
	if (!state) {
		state = getDefaultState();
	}

	switch (type) {
		case RootActions.loadFromDB.actionType:
		case PlansActions.create.actionType:
		case PlansActions.update.actionType:
			state = updatePlans(payload.plans, state);
			break;
		case PlansActions.delete.actionType:
			state = removePlans(payload.deletedPlans, state);
			break;
	}

	return state;
}

module.exports = PlansStore;


function getDefaultState() {
	return Map({
		default: createPlan({
			id: 'default',
			name: 'default'
		})
	});
}

function createPlan(planData) {
	return Map({
		id: planData.id.toString(),
		name: planData.name,
		schedules: planData.schedules
	});
}

function updatePlans(plans, state) {
	if (plans) {
		plans.forEach(function(plan) {
			var newPlan;
			if (state.has(plan.id)) {
				newPlan = state.get(plan.id).merge(Map(plan));
			}
			else {
				newPlan = createPlan(plan);
			}

			state = state.set(newPlan.get('id'), newPlan);
		});
	}

	return state;
}

function removePlans(plans, state) {
	plans.forEach(function(planId) {
		state = state.delete(planId);
	});

	return state;
}
