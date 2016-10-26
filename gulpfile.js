// Include Gulp
var gulp = require('gulp');
var nodemon = require('nodemon');
var notifier = require('node-notifier');

// Include plugins
var plugins = require("gulp-load-plugins") ({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files',
				'merge-stream', 'run-sequence', 'webpack-stream'],
	replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var dest = 'www/public/';

gulp.task('server', ['koa server','webpack', 'fonts', 'sass', 'watch']);
gulp.task('default', ['webpack', 'fonts', 'sass', 'watch']);

gulp.task('setup', function(done) {
	plugins.runSequence('bower', ['webpack', 'fonts', 'sass'], done);
});

gulp.task('bower', function() {
	return plugins.bower();
});

gulp.task('webpack', function() {
	return gulp.src('src/js/app.js')
		.pipe(plugins.webpackStream( require('./webpack.config.js')))
		.on('error', swallowError)
		.pipe(gulp.dest(dest + 'js'))
		.pipe(plugins.livereload())
		.on('end', function() {
			notifier.notify({
				'title': 'Gulp',
				'message': 'Webpack Finished'
			})
		});
});

gulp.task('css', function() {
	var lessFiles = ['src/less/*'];

	var cssStream = gulp.src(plugins.mainBowerFiles())
		.pipe(plugins.filter('**/*.css'))
		.pipe(plugins.order([
			'normalize.css',
			'*'
		]));

	var lessStream = gulp.src(plugins.mainBowerFiles().concat(lessFiles))
		.pipe(plugins.filter('*.less'))
		.pipe(plugins.less())
		.on('error', swallowError);

	return plugins.mergeStream(cssStream, lessStream)
		.pipe(plugins.concat('main.css'))
		.pipe(plugins.cleanCss())
		.on('error', swallowError)
		.pipe(gulp.dest(dest + 'css'))
		.pipe(plugins.livereload());
});

gulp.task('sass', function() {
	var sassEntry = './src/sass/main.scss';

	return gulp.src(sassEntry)
		.pipe(plugins.sass())
		.on('error', swallowError)
		.pipe(plugins.cleanCss())
		.pipe(gulp.dest(dest + 'css'))
		.pipe(plugins.livereload())
		.on('end', function() {
			notifier.notify({
				'title': 'Gulp',
				'message': 'Sass Finished'
			})
		});
});

gulp.task('fonts', function() {
	var fontDirectories = [
		'./bower_components/materialize/fonts/**/*.*'
	]
	return gulp.src(fontDirectories)
		.pipe(gulp.dest(dest + 'fonts'));
});

var server;

gulp.task('koa server', function (cb) {
	// plugins.nodemon({
	// 	script: 'index.js',
	// 	ext: 'js pug',
	// 	env: {'NODE_ENV': 'development'}
	// });
	server = nodemon({
		script: 'index.js',
		ext: 'js pug',
		env: {'NODE_ENV': 'development'}
	})
	.on('quit', function() {
		process.exit()
	});
});

gulp.task('watch', function() {
	plugins.livereload.listen();
	gulp.watch(['src/js/**/*.js', 'src/vue/**/*.vue'], ['webpack']);
	// gulp.watch('src/less/**/*.less', ['css']);
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('./**/*.html').on('change', function(file) {
		plugins.livereload.changed(file.path);
	})
});

if (process.platform === "win32") {
	var rl = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.on("SIGINT", function () {
		process.emit("SIGINT");
	});
}

process.on('SIGINT', function () {
	server.emit('quit');
	// process.exit();
});

function swallowError(error) {
	console.log(error.toString());
	this.emit('end');
}
