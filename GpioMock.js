var GpioMock = function(number, direction, logger) {
	this.logger = logger.child({component: 'GPIO Mock'});
	this.number = number;
	this.value = false;
}; GpioMock.prototype.constructor = GpioMock;

module.exports = GpioMock;

GpioMock.prototype.write = function (value, callback) {
	this.logger.debug('Pin:', this.number, 'Value:', value);
	this.value = value;
	return callback(null);
};

GpioMock.prototype.writeSync = function (value) {
	this.logger.debug('Pin:', this.number, 'Value:', value);
	this.value = value;
};

GpioMock.prototype.read = function (callback) {
	return callback(null, this.value);
};

GpioMock.prototype.readSync = function () {
	return this.value;
};

GpioMock.prototype.unexport = function () {
	this.logger.debug('Pin:', this.number, 'Unexported');
	this.unexported = true;
};
