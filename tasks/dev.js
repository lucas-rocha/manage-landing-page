const { src, dest, watch, series, parallel, task } = require('gulp');
const plugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
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
		.pipe(dest(paths.html.dist))
		.on('end', browserSync.reload);
};

function styles() {
	return src(paths.scss.src)
	    .pipe(plugins.sourcemaps.init())
	    .pipe(plugins.sass().on("error", plugins.sass.logError))
	    .pipe(
	      plugins.autoprefixer({
	        cascade: false,
	      })
	    )
	    .pipe(plugins.sourcemaps.write())
	    .pipe(dest(paths.scss.dist))
	    .on("end", browserSync.reload);
};

function scripts() {
	return src(paths.js.src)
		.pipe(plugins.sourcemaps.init())
		.pipe(
		  plugins.babel({
		    presets: ['@babel/env'],
		  })
		)
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(dest(paths.js.dist))
		.on("end", browserSync.reload);
};

function images() {
	return src(paths.img.src)
		.pipe(dest(paths.img.dist))
		.on("end", browserSync.reload);
};

function libs() {
	return src('node_modules/@glidejs/glide/dist/glide.min.js')
		.pipe(plugins.concat('vendor.js'))
		.pipe(dest(paths.js.dist));
};


function server() {
	browserSync.init({
		server: {
		  baseDir: './dist'
		},
	});
	watch('*.html').on('change', browserSync.reload);
};

function watchTasks() {
	watch(paths.html.src, html);
	watch(paths.scss.src, styles);
	watch(paths.img.src, images);
	watch(paths.js.src, scripts);
};

task('dev', series(clean, 
	parallel(html, styles, scripts, images, libs),
	parallel(server, watchTasks)
	)
);