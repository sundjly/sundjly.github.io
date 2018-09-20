//加载gulp-load-plugins插件，并马上运行它
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// 压缩css
gulp.task("css", function () {
    return gulp.src(["./public/**/*.css", "!./public/**/*.min.css"])
        .pipe(plugins.minifyCss({
            compatibility: "ie8"
        }))
        .pipe(gulp.dest("./public/"));
});
// 压缩js
gulp.task("js", function () {
    return gulp.src(["./public/**/*.js", "!./public/**/*.min.js"])
        .pipe(plugins.uglify())
        .pipe(gulp.dest("./public/"));
});
// 压缩Html
gulp.task("html", function () {
    return gulp.src("./public/**/*.html")
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest("./public/"));
});

// 压缩图片
gulp.task("images",function(){
    gulp.src('./public/images/*.*')
    .pipe(plugins.imagemin({
        progressive:true
    }))
        .pipe(gulp.dest("./public/images/"));
});
// 默认执行顺序
gulp.task("default", ["css", "js", "html", "images"], function () {
    console.log("gulp task finished!");
});


// // 监听事件
// gulp.task("watch", function () {
//     gulp.watch("./public/*", ["default"]);
// });
