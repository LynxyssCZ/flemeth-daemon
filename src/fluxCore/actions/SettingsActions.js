module.exports = {
	update: function(settingData) {
		var Setting = this.db.getModel('Settings');

		return [
			{ settings: [ settingData ] },
			Setting.forge({ key: settingData.key })
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
			})
		];
	},
	create: function(settingData) {
		return [
			{ settings: [settingData] },
			this.db.getModel('Settings').forge(settingData).save()
				.then(function(setting) {
					if (setting) {
						return {
							settings: [setting.toJSON()]
						};
					}
				})
		];
	},
	delete: function(settingKey) {
		var Setting = this.db.getModel('Settings');

		return [
			{ deletedSettings: [settingKey] },
			Setting.forge().where({key: settingKey})
				.fetch()
				.then(function(model) {
					if (model) {
						return model.destroy();
					}
				})
				.then(function() {
					return {deletedSettings: [settingKey]};
				})
		];
	}
};
