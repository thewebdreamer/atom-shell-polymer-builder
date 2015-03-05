var gulp = require('gulp'),
	gulpGrunt = require('gulp-grunt'),
	del = require('del'),
	glob = require('glob'),
	path = require('path'),
	logger = require('./common/logger.js'),



	buildOptions = {},
	cleanupPatterns = [
		'./dist/debug/**',
        './app/bower_components/**',
	],
    watcher = null,
    appProcess = null;


function runCallback (callback) {
	'use strict';

	if(!!callback && typeof (callback) === 'function') {
		callback();
	}
    else {
        logger.logMessage('A bad callback was trying to be called.', logger.logLevels.WARNING);
    }
}


function registerGruntTasks () {
	'use strict';

	return gulpGrunt.tasks({
		base: path.join(__dirname, './Grunt/dev'),
		prefix: '',
		verbose: true
	});
}


function setBuildOptions (buildOpts) {
    'use strict';

    buildOptions = buildOpts;
}


function registerTasks () {
	'use strict';

	var gruntTasks = registerGruntTasks(),
		tasks = {
			'cleanupTask': null,
			'verifyTask': null,
			'saveBuildOptionsTask': null,
			'buildAtomShellTask': null,
			'copyBowerComponents': null,
			'copyAppToAtomShell': null,
			'runAtomShellTask': null,
            'watchTask': null,
            'stopWatchTask': null,
		};

	tasks.cleanupTask = function devCleanupTask (callback) {
		del(cleanupPatterns, 
            { cwd: path.join(__dirname, './../') }, function removeHandler(err, deletedFiles) {
			if(!!err) {
				logger.logMessage(err, logger.logLevels.ERROR);
			}
			else {
				logger.logMessage('Files deleted: ' + deletedFiles.join(',\n'));
				runCallback(callback);
			}
		});
	};

	tasks.verifyTask = function devVerifyTask (callback) {
		var files, 
			isClean = true,
			patternCount = 0;
		for(; patternCount < cleanupPatterns.length; patternCount++) {
			files = glob.sync(cleanupPatterns[patternCount], {cwd: path.join(__dirname, './../')});
			if(files.length > 0) {
				logger.logMessage('Warning: cleanup was not properly done for the path "' + 
									cleanupPatterns[patternCount] +
									'". The following files were left behind: ' + 
									files.join('",\n') + 
									'.', 
							      logger.logLevels.WARNING);
				isClean = false;
			}
		}

		if(isClean) {
			logger.logMessage('All files were properly removed.', logger.logLevels.INFO);
		}
		runCallback(callback);
	};

	tasks.saveBuildOptionsTask = function devSaveBuildOptionsTask(callback) {
        var fullPath = path.join(__dirname, './grunt/dev/buildOptions.json');
        require('fs').writeFile(fullPath, JSON.stringify(buildOptions), function writeHandler(err) {
			if(!!err) {
		        logger.logMessage(err, logger.logLevels.ERROR);
		    }
            else {
                logger.logMessage('Build options have been properly stored.', logger.logLevels.INFO);
                runCallback(callback);
            }
		});
	};

	tasks.buildAtomShellTask = function devBuildAtomShellTask (callback) {
        gruntTasks['build-atom-shell'](callback);
	};

	tasks.copyBowerComponents = function devCopyBowerComponents (callback) {
        gulp.src('./bower_components/**', { cwd: path.join(__dirname, './../') })
            .pipe(gulp.dest('./app/bower_components/', { cwd: path.join(__dirname, './../') }))
            .on('end', function streamEndHandler() {
                runCallback(callback);
            });
	};

	tasks.copyAppToAtomShell = function devCopyAppToAtomShell (callback) {
		logger.logMessage('Copying app to atom-shell.', logger.logLevels.INFO);
		gulp.src('./app/**', { cwd: path.join(__dirname, './../') })
			.pipe(gulp.dest('./dist/debug/' + buildOptions.productName + '.app/Contents/Resources/app/', 
                            { cwd: path.join(__dirname, './../') }))
            .on('end', function streamEndHandler() {
                runCallback(callback);
            });
	};

	tasks.runAtomShellTask = function devRunAtomShellTask (callback) {
        if(!appProcess){
            logger.logMessage('Launching app now...', logger.logLevels.INFO);
            appProcess = require('child_process').spawn('open', [path.join(__dirname, './../dist/debug/' + 
                                                                            buildOptions.productName + 
                                                                            '.app')]);
        }
		runCallback(callback);
	};

    tasks.watchTask = function devWatchTask (callback) {
        if (!watcher) {
            var fullPath = path.join(__dirname, './../app/**');
            console.log(fullPath);
            watcher = gulp.watch(fullPath, ['watch']);
            watcher.on('change', function watcherChangeHandler(event) {
                logger.logMessage('File ' + event.path + ' was ' + event.type + ', running tasks...',
                                  logger.logLevels.INFO);
            });
            logger.logMessage('Started watcher.', logger.logLevels.INFO);
        }
        runCallback(callback);
    };

    tasks.stopWatchTask = function devStopWatchTask (callback) {
        if (!!watcher) {
            watcher.end();
            watcher = null;
            logger.logMessage('Stopped watcher.', logger.logLevels.INFO);
        }
        runCallback(callback);
    };

	return tasks;
}


module.exports = {
	setBuildOptions: setBuildOptions,
	taskDefinitions: registerTasks(),
};