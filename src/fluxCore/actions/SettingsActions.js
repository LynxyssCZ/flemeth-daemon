module.exports = {
	update: function* updateSettings(settingData) {
		var Setting = this.db.getModel('Settings');

		yield { settings: [ settingData ] };
		yield Setting.forge({ key: settingData.key })
			.fetch()
			.then(function(model) {
				if (model) {
					return model.save(settingData);
				}
				else {
					return Setting.forge(settingData).save();
				}
			})
			.then(function(setting) {
				return { settings: [setting.toJSON()] };
			});
	},
	create: function* createSetting(settingData) {
		yield { settings: [settingData] };

		yield this.db.getModel('Settings').forge(settingData).save()
			.then(function(setting) {
				if (setting) {
					return { settings: [setting.toJSON()] };
				}
			});
	},
	delete: function* deleteSetting(settingKey) {
		var Setting = this.db.getModel('Settings');

		yield { deletedSettings: [settingKey] };

		yield Setting.forge().where({key: settingKey}).destroy()
			.then(function() {
				return {deletedSettings: [settingKey]};
			});
	}
};
