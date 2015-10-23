var SensorsManager = require('./src/thermostat/SensorsManager');

var manager = new SensorsManager({
	callback: function (argument) {
		console.log(argument);
	}
});

manager.addSensor('DS18B20', 'DS18B20', {
	interval: 5000
});

manager.start();
