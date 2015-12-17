var tagActions = require('fluxerino').Utils.tagActions;

module.exports = tagActions({
	Override: require('./OverrideActions'),
	Plans: require('./PlansActions'),
	Root: require('./RootActions'),
	Schedules: require('./SchedulesActions'),
	Sensors: require('./SensorsActions'),
	Snapshots: require('./SnapshotsActions'),
	Settings: require('./SettingsActions'),
	Switcher: require('./SwitcherActions'),
	TempChecker: require('./TempCheckerActions'),
	Zones: require('./ZonesActions')
});
