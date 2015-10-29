var tagActions = require('fluxerino').Utils.tagActions;

module.exports = tagActions({
	Sensors: require('./SensorsActions'),
	Zones: require('./ZonesActions')
});
