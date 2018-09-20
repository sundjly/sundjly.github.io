---
title: 从博客优化学习gulp入门
date: 2017-12-10 
categories: gulp
tags: [gulp,优化]
---


个人博客是用HEXO + Next +Github Page搭建起来的，有兴趣的可以看一下我的另外一篇博客
，这样子搭建起来发现有的时候博客首页加载用时8s，这已经超出了能忍受的预期，所以是时候来优化一下了



<!--more-->
当然优化Hexo博客，还可用[hexo neat插件](https://github.com/Rozbo/hexo-neat#hexo-neat)
，在站点配置文件添加示例属性即可完成优化

#### [首先介绍以下网页优化的一般方法：](https://zhuanlan.zhihu.com/p/30267442)

    代码层面：避免使用css表达式，避免使用高级选择器，通配选择器。
    
    缓存利用：缓存Ajax，使用CDN，使用外部js和css文件以便缓存，添加Expires头，服务端配置Etag，减少DNS查找等
    
    请求数量：合并样式和脚本，使用css图片精灵，初始首屏之外的图片资源按需加载，静态资源延迟加载。
    
    请求带宽：压缩文件，开启GZIP，
    
    代码层面的优化
    用hash-table来优化查找
    
    少用全局变量
    
    用innerHTML代替DOM操作，减少DOM操作次数，优化javascript性能
    
    用setTimeout来避免页面失去响应
    
    缓存DOM节点查找的结果
    
    避免使用CSS Expression
    
    避免全局查询
    
    避免使用with(with会创建自己的作用域，会增加作用域链长度)
    
    多个变量声明合并
    
    避免图片和iFrame等的空Src。空Src会重新加载当前页面，影响速度和效率
    
    尽量避免在HTML标签中写Style属性

当然对于博客都是自动完成，我们能做的
##### 只有对代码的压缩以及图片的处理。
**一般情况下 jpg 图片选择品质中即可，png 格式图片选择 png8 即可，但注意有透明背景的 png 图片要选择 png24 ，否则透明背景中会出现白边，gif 图片选择 gif64 无仿色即可。**

##### 使用免费 cdn 加载第三方资源、静态资源

一般网站 90% 的流量都用于静态资源的加载，除了用免费 cdn 加载第三方资源，还可以自己申请云空间储存自己的静态资源，进一步减小服务器的开销，让服务器只专注于提供数据或者网页渲染服务。


#### gulp了解
gulpjs使用的是nodejs中stream来读取和操作数据，其速度更快，与webpack一样都是前端构建工具，不过它的APi简洁

https://www.gulpjs.com.cn/docs/getting-started/

##### [工作原理过程](https://www.cnblogs.com/2050/p/4198792.html)
Grunt主要是以文件为媒介来运行它的工作流的，比如在Grunt中执行完一项任务后，会把结果写入到一个临时文件中，然后可以在这个临时文件内容的基础上执行其它任务，执行完成后又把结果写入到临时文件中，然后又以这个为基础继续执行其它任务...就这样反复下去。而在Gulp中，使用的是Nodejs中的stream(流)，首先获取到需要的stream，然后可以通过stream的pipe()方法把流导入到你想要的地方，比如Gulp的插件中，经过插件处理后的流又可以继续导入到其他插件中，当然也可以把流写入到文件中。所以Gulp是以stream为媒介的，它不需要频繁的生成临时文件，这也是Gulp的速度比Grunt快的一个原因。再回到正题上来，gulp.src()方法正是用来获取流的，但要注意这个流里的内容不是原始的文件流，而是一个虚拟文件对象流(Vinyl files)，这个虚拟文件对象中存储着原始文件的路径、文件名、内容等信息，这个我们暂时不用去深入理解，你只需简单的理解可以用这个方法来读取你需要操作的文件就行了。其语法为：
```
gulp.src(globs[, options])
```
globs参数是文件匹配模式(类似正则表达式)，用来匹配文件路径(包括文件名)，当然这里也可以直接指定某个具体的文件路径。当有多个匹配模式时，该参数可以为一个数组。
options为可选参数。通常情况下我们不需要用到。


##### 1. 博客根目录下创建gulpfile.js文件
此时我们的目录结构是这样子的：
```
├── gulpfile.js
├── node_modules
│ └── gulp
└── package.json
```
##### 2. 安装gulp以及依赖插件并保存到项目依赖
```
npm i -d --save gulp gulp-clean gulp-load-plugins gulp-minify-css gulp-minify-html gulp-rename gulp-uglify gulp-shell
```
##### 3. 编写gulp优化任务
hexo编译后生成的代码文件都在public目录下,因此我们的待优化源文件都在该目录下.并且所有的子目录下的文件也都要被优化,并且开源的库文件比如jquery等一般已经是优化压缩过的,不需要再压缩,因此需要将带有.min后缀的文件排除.于是待优化源文件的路径就可以确定了.
优化过的文件统一输出到项目根目录下的dst目录下.

###### 3.1 压缩图片--[gulp-imagemin的介绍](https://www.npmjs.com/package/gulp-imagemin)
```
// 压缩图片
gulp.task("images",function(){
    gulp.src('./public/images/*.*')
    .pipe(plugins.imagemin({
        progressive:true
    }))
        .pipe(gulp.dest("./public/"));
})
```
###### 3.2 压缩css
```
gulp.task("css",function() {
    return gulp.src(["public/**/*.css","!public/**/*.min.css"])
    .pipe(plugins.minifyCss({compatibility: "ie8"}))
    .pipe(gulp.dest("./dst/"));      
});
以上任务以原目录结构输出到dst目录,保持原有文件名不变
```

###### 3.4 压缩html
```
gulp.task("html",function() {
    return gulp.src("public/**/*.html")
    .pipe(plugins.minifyHtml())
    .pipe(gulp.dest("./dst/");
});
以上三个任务基本上就将博客的所有静态文件都优化压缩过了,当然如果博客内还有本地图片的话,还可以对图片进行压缩.
为了更加方便的进行代码的优化压缩,有必要定义默认任务以及文件监听.
```
##### 3.5 默认任务
```
gulp.task("default",["css","js","html"],function() {
    console.log("gulp task finished!");
});
以上默认任务依赖前述定义的所有任务,在依次执行完所有任务后仅输出任务完成提示.
```

##### 3.6 文件监听
每次手动执行还是不够高效,我们再来定义一个监听任务,让Hexo每次编译之后自动进行优化.
```
gulp.task("watch",function() {
    gulp.watch("public/*",["default"]);
});
```
上述监听任务可以使用nohup gulp watch运行在后台,一旦public目录有变动就会自动运行default任务,即整个博客的优化任务.



完整的代码：
```
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
        .pipe(gulp.dest("./public/"));
});
// 默认执行顺序
gulp.task("default", ["css", "js", "html", "images"], function () {
    console.log("gulp task finished!");
});


// 监听事件
gulp.task("watch", function () {
    gulp.watch("public/*", ["default"]);
});

```
目前，在博客根目录下运行gulp，的确能起到压缩的效果，但是进行
```
hexo clean && hexo g && hexo d
```
博客提交之后，产生的压缩会消失，还在思考中

#### 参考文献

[参考了使用gulp精简hexo博客代码](http://zhangjh.me/2016/02/19/gulp-minify-blog/)

[Hexo折腾记——性能优化篇](https://yq.aliyun.com/articles/8608)