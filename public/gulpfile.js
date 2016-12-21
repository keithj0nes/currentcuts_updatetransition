//1. Make gulpfile.js
//2. npm init in terminal to create node_modules
//3. npm i in terminal to install all dependencies
//4. Check all folder paths used in gulpfile
//5. Update index.html
//6. Must build-css and build-js before running gulp watch
//7. Run gulp watch to watch for scss / js changes
//8. Use ctrl + C in terminal to kill the watch


var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    del = require("del"),
    concat = require("gulp-concat"),
    babel = require("gulp-babel"),
    print = require("gulp-print"),
    uglify = require("gulp-uglify");

var CacheBuster = require("gulp-cachebust");
var cachebust = new CacheBuster();

gulp.task("sayhello", function(){
  console.log("hello dmkjasdl");
})


gulp.task("clean", function(cb){
  del(["dist"],cb)
})

gulp.task("build-css", function(){
  gulp.src("./styles/*")
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(cachebust.resources())
      .pipe(concat("styles.css"))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./dist'));
})

gulp.task("build-js", function(){
  return gulp.src("js/**/*.js")
      .pipe(sourcemaps.init())
      .pipe(print())
      .pipe(babel({presets: ["es2015"]}))
      .pipe(concat("bundle.js"))
      // .pipe(uglify())  //keep commented out until ready to ship
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./dist/js"));
})

gulp.task("build", ["build-css", "build-js"], function(){
  return gulp.src("index.html")
      .pipe(cachebust.references())
      .pipe(gulp.dest("./dist"));
})

gulp.task('watch', function() {
    return gulp.watch(['./index.html','./partials/*.html', './styles/*.*css', './js/**/*.js'], ['build']);
});
