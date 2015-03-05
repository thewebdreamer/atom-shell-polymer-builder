var gulp = require('gulp'),
    argv = require('yargs').argv,
    path = require('path'),
    logger = require('./gulp/common/logger.js'),
    devDefinition = require('./gulp/dev-task-definitions.js');


function registerDevTasks(dev) {
	'use strict';

	if(!dev) {
		logger.logMessage('Unable to register the gulp dev tasks! The task definitions object is undefined', 
						  logger.logLevels.ERROR);
	}

	//List of development tasks, useful for programming, testing and debugging.
    //Internal tasks:
	gulp.task('cleanup', dev.cleanupTask);
	gulp.task('verify', ['cleanup'], dev.verifyTask);
	gulp.task('save-build-options', ['verify'], dev.saveBuildOptionsTask);
	gulp.task('build-atom-shell', ['save-build-options'], dev.buildAtomShellTask);
	gulp.task('copy-bower-components', ['stopWatch', 'build-atom-shell'], dev.copyBowerComponents);
	gulp.task('copy-app-to-atom-shell', ['copy-bower-components'], dev.copyAppToAtomShell);
    gulp.task('run-atom-shell', ['copy-app-to-atom-shell'],dev.runAtomShellTask);
    gulp.task('watch', ['run-atom-shell-only'], dev.watchTask);
    gulp.task('stopWatch', dev.stopWatchTask);
    gulp.task('copy-bower-components-only', ['stopWatch'], dev.copyBowerComponents);
    gulp.task('copy-app-to-atom-shell-only', ['copy-bower-components-only'], dev.copyAppToAtomShell);
    gulp.task('run-atom-shell-only', ['copy-app-to-atom-shell-only'],dev.runAtomShellTask);

    //Public tasks:
    gulp.task('build', ['copy-app-to-atom-shell']);
    gulp.task('run', ['run-atom-shell-only']);
    gulp.task('build-run', ['run-atom-shell']);
    gulp.task('run-watch', ['watch']);
    
	logger.logMessage('Finished with registring the development tasks.', logger.logLevels.INFO);
}


function registerProdTasks(prod) {
	'use strict';

	if(!prod) {
		logger.logMessage('Unable to register the gulp prod tasks! The task definitions object is undefined', 
						  logger.logLevels.ERROR);
	}

	//List of production tasks, useful for packaging everything together
	gulp.task('cleanup', prod.cleanupTask);
	gulp.task('verify', prod.verifyTask);
	gulp.task('vulcanize', prod.vulcanizeTask);
	gulp.task('transpile-less', prod.transpileLessTask);
	gulp.task('build-atom-shell', prod.buildAtomShellTask);
}



// This is where everything starts...
if(!!argv.debug){
	logger.logMessage('Registering development tasks.', logger.logLevels.INFO);
	devDefinition.setBuildOptions({
		tag: 'v0.21.2',
		buildDir: path.join(__dirname, './tmp/debug/atom-shell'),
	    targetDir: path.join(__dirname, './dist/debug'),
    	projectName: 'mycoolapp',
	    productName: 'MyCoolApp',
	    config: 'Debug'
	});
	registerDevTasks(devDefinition.taskDefinitions);
}
else {
	if(!!argv.release) {
		//TODO: create release version
		//registerProdTasks(new prodDefinition());
	}
	else {
		logger.logMessage('Unable to load the gulp tasks!', logger.logLevels.ERROR);
		logger.logMessage('You must pass a configuration as an argument (debug, release...)!', 
                          logger.logLevels.WARNING);
	}
}