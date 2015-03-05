var app = require('app'),  // Module to control application life.
	BrowserWindow = require('browser-window');  // Module to create native browser window.


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;


function onAllWindowsClosed() {
	'use strict';

	if (process.platform !== 'darwin') {
		app.quit();
	}
}


function onWindowClosed() {
	'use strict';

	// Dereference the window object, usually you would store windows
	// in an array if your app supports multi windows, this is the time
	// when you should delete the corresponding element.
	mainWindow = null;
}


function onWindowReady() {
	'use strict';

	mainWindow = new BrowserWindow({
	  	width: 800, 
	  	height: 600
	});

	// and load the index.html of the app.
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	// Emitted when the window is closed.
	mainWindow.on('closed', onWindowClosed);
}


app.on('window-all-closed', onAllWindowsClosed); // Quit when all windows are closed.
app.on('ready', onWindowReady); // This method will be called when atom-shell has done everything initialization and ready for creating browser windows.