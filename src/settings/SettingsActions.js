module.exports = {
	update: function* updateSettings(settingData) {
		const Setting = this.app.methods.db.getModel('Setting');

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

		yield this.app.methods.db.getModel('Setting').forge(settingData).save()
			.then(function(setting) {
				if (setting) {
					return { settings: [setting.toJSON()] };
				}
			});
	},
	delete: function* deleteSetting(settingKey) {
		const Setting = this.app.methods.db.getModel('Setting');

		yield { deletedSettings: [settingKey] };

		yield Setting.forge().where({key: settingKey}).destroy()
			.then(function() {
				return {deletedSettings: [settingKey]};
			});
	}
};
