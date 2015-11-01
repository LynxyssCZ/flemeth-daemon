var tagActions = require('fluxerino').Utils.tagActions;

module.exports = tagActions({
	Root: require('./RootActions'),
	Sensors: require('./SensorsActions'),
	Zones: require('./ZonesActions')
});
