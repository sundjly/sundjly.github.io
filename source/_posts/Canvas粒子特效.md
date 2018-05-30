---
title: 关于canvas粒子特效实现分析
date: 2017-11-14 
categories: canvas
tags: [canvas,经验]
---

1. 关于canvas教程可以看 https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial ，了解关于画线和圆形的相关步骤就行

<!--more-->
2. canvas粒子特效要实现的效果：

- 粒子大小在一定范围内随机波动
- 粒子的位置是随机的
- 粒子的个数是固定的
- 当鼠标移动时，在鼠标周围产生特定的粒子并连线，向四周移动，达到一定条件消失。

参考了[知乎登录首页 canvas](https://segmentfault.com/a/1190000009037017) 和一个少女心满满的例子[带你入门 Canvas](https://juejin.im/post/5986d6e1f265da3e241e8cdb#heading-26)

关于动画是使用

requestAnimationFrame（）函数实现的。
效果如下：

![image](/images/canvas.gif)

code:
```
;
(function (undefined) {
    "use strict";
    var _global;

    /*
     * @var star_r：star半径系数，系数越大，半径越大
     * @var star_alpha：生成star的透明度，star_alpha越大，透明度越低
     * @var initStarsPopulation：初始化stars的个数
     * @var move_distance：star位移的距离，数值越大，位移越大
     * @var dot_r : dot半径系数，系数越大，半径越大
     * @var dot_speeds : dots运动的速度
     * @var dot_alpha : dots的透明度
     * @var aReduction：dot消失条件，透明度小于aReduction时消失
     * @var dotsMinDist：dot最小距离
     * @var maxDistFromCursor：dot最大距离
     *
     * */
    var config = {
        star_r: 3,
        star_alpha: 5,
        initStarsPopulation: 150,
        move_distance: 0.25,
        dot_r: 5,
        dot_speeds: 0.5,
        dot_alpha: 0.5,
        dot_aReduction: 0.01,
        dotsMinDist: 5,
        maxDistFromCursor: 50,
    };
    var stars = [],
        canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d'),
        WIDTH,
        HEIGHT;

    function CanvasStar(conf) {
        this.init(conf);
    }
//初始化函数        实例化CanvasStar      然后运行init()
    var initConfig = function (conf) {
        if (conf instanceof Object)
            for (var item in conf) {
                config[item] = conf[item];
            }
    };

    CanvasStar.prototype.init = function (conf) {
        initConfig(conf); //初始化设置

        ctx.strokeStyle = "black";
        ctx.shadowColor = "black";
        for (var i = 0; i < config.initStarsPopulation; i++) {
            stars[i] = new CircleStar(i, Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT), true);
            //stars[i].draw();
        }
        ctx.shadowBlur = 0;
        animate();
    };

    function CircleStar(id, x, y, useCache) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.useCacha = useCache;
        this.cacheCanvas = document.createElement("canvas");
        this.cacheCtx = this.cacheCanvas.getContext("2d");
        this.r = Math.floor(Math.random() * config.star_r) + 1;
        this.cacheCtx.width = 6 * this.r;
        this.cacheCtx.height = 6 * this.r;
        var alpha = (Math.floor(Math.random() * 10) + 1) / config.star_alpha;
        this.color = "rgba(0,0,0," + alpha + ")";
        if (useCache) {
            this.cache();
        }
    }

    CircleStar.prototype = {
        draw: function () {
            if (!this.useCacha) {
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.r * 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            } else {
                ctx.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r);
            }
        },

        cache: function () {
            this.cacheCtx.save();
            this.cacheCtx.fillStyle = this.color;
            this.cacheCtx.shadowColor = "white";
            this.cacheCtx.shadowBlur = this.r * 2;
            this.cacheCtx.beginPath();
            this.cacheCtx.arc(this.r * 3, this.r * 3, this.r, 0, 2 * Math.PI);
            this.cacheCtx.closePath();
            this.cacheCtx.fill();
            this.cacheCtx.restore();
        },

        move: function () {
            this.y -= config.move_distance;
            if (this.y <= -10) {
                this.y += HEIGHT + 10;
            }
            this.draw();
        },

        die: function () {
            stars[this.id] = null;
            delete stars[this.id];
        }
    };

    // 完成动画重绘的过程
    function animate() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for (var i in stars) {
            stars[i].move();
        }
        requestAnimationFrame(animate);
    }

    function degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    function setCanvasSize() {
        WIDTH = document.documentElement.clientWidth;
        HEIGHT = document.documentElement.clientHeight;
        canvas.setAttribute("width", WIDTH);
        canvas.setAttribute("height", HEIGHT);
    }
    setCanvasSize();
    // 最后将插件对象暴露给全局对象
    _global = (function () {
        return this || (0, eval)('this');
    }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = CanvasStar;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return CanvasStar;
        });
    } else {
        !('CanvasStar' in _global) && (_global.CanvasStar = CanvasStar);
    }
})();
```
 

进行初始化：
```
<script>
    var CanvasStar=new CanvasStar();
</script>
    
```
　　

 