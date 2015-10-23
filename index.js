var SensorsManager = require('./src/thermostat/SensorsManager');

var manager = new SensorsManager({
	callback: function (name, value) {
		console.log(name, value);
	}
});

manager.addSensor('DS18B20', 'DS18B20', {
	interval: 5000
});

manager.start();
