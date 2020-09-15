const { src, dest, series, task } = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');

const paths = {
	html: {
		src: './src/*.html',
		dist: './dist',
	},
	scss: {
		src: './src/scss/**/*.scss',
		dist: './dist/css',
	},
	img: {
		src: './src/images/*.*',
		dist: './dist/images',
	},
	js: {
		src: './src/js/*.js',
		dist: './dist/js',
	},
}

function clean() {
	return del(['./dist/*']);
};

function html() {
	return src(paths.html.src)
		.pipe(
			plugins.removeEmptyLines({
				removeComments: true,
			})
		)
		.pipe(
			plugins.htmlmin({
				collapseWhitespace: true
			})
		)
		.pipe(plugins.replace('.css', 'min.css'))
		.pipe(plugins.replace('.js', 'min.js'))
		.pipe(dest(paths.html.dist));
};

function styles() {
	return src(paths.scss.src)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass().on('error', plugins.sass.logError))
		.pipe(
			plugins.autoprefixer({
				cascade: false,
			})
		)
		.pipe(plugins.cssnano())
		.pipe(
			plugins.rename({
				suffix: '.min',
			})
		)
		.pipe(plugins.sourcemaps.write())
		.pipe(dest(paths.scss.dist))
};

function scripts() {
	return src(paths.js.src, {
		allowEmpty: true,
	})
	.pipe(plugins.sourcemaps.init())
	.pipe(
		plugins.babel({
			presets: ['@babel/env'],
		})
	)
	.pipe(plugins.uglify())
	.pipe(
		plugins.rename({
			suffix: '.min',
		})
	)
	.pipe(plugins.sourcemaps.write())
	.pipe(dest(paths.js.dist))
};

function images() {
	return src(paths.img.src)
		.pipe(dest(paths.img.dist))
};

function libs() {
	return src('node_modules/@glidejs/glide/dist/glide.min.js')
		.pipe(plugins.concat('vendor.js'))
		.pipe(
			plugins.rename({
				suffix: '.min',
			})
		)
		.pipe(dest(paths.js.dist));
}

task('build', series(clean, 
	series(html, styles, scripts, images, libs))
);