
var gulp 		= require('gulp');
var sass 		= require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify 		= require('gulp-uglify');//minify JS files
var gulpIf 		= require('gulp-if');//minify ONLY JS files
var cssnano 	= require('gulp-cssnano');
var useref 		= require('gulp-useref');
var taskListing = require('gulp-task-listing');
var imagemin 	= require('gulp-imagemin');
var cache 		= require('gulp-cache');
var del 		= require('del');

gulp.task('default', ['help']);

gulp.task('help', taskListing);

gulp.task('sass', function() {
	
  console.log('Starting sass');

  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

// concatenate JS files in one
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
     // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))

})

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

//sequence task example
gulp.task('task-name', function(callback) {
  runSequence('task-one', ['tasks','two','run','in','parallel'], 'task-three', callback);
});

gulp.task('watch', ['browserSync', 'sass', 'useref', 'images', 'fonts'], function(){
  
  console.log('Building files');
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
  // Other watchers
})


