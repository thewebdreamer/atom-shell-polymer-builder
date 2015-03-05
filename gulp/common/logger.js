var chalk = require('chalk');
var dateHelper = require('./date-helper.js'); 

var logLevels = {
	DEBUG: 1,
	INFO: 2,
	WARNING: 3,
	ERROR: 4,
	UNKNOWN: 0
};


var debug = chalk.magenta.bold;
var info = chalk.blue.bold;
var warning = chalk.yellow.bold;
var error = chalk.red.bold;
var unknown = chalk.cyan.bold;
var time = chalk.white.underline;


function logMessage(message, logLevel) {
	"use strict";

	var currentTime = dateHelper.getTime();
	switch (logLevel) {
		case logLevels.DEBUG:
			console.log("["+time(currentTime)+"]", debug("[ Debug ] " + message));
			break;
		case logLevels.INFO:
			console.log("["+time(currentTime)+"]", info("[ Info ] " + message));
			break;
		case logLevels.WARNING:
			console.log("["+time(currentTime)+"]", warning("[ Warning ] " + message));
			break;
		case logLevels.ERROR:
			console.log("["+time(currentTime)+"]", error("[ Error ] " + message));
			break;
		case logLevels.UNKNOWN:
			console.log("["+time(currentTime)+"]", unknown("[ Unknown ] " + message));
			break;
		default:
			if(!!logLevel) {
				logMessage("An invalid log level was entered the message was: " + message, logLevels.WARNING);
			}
	}
}

module.exports = {
	logLevels: logLevels,
	logMessage: logMessage
};