---
title: 浅析jQuery源码
date: 2017-08-14 
categories: jQuery
tags: [jQuery,js]
---

### jQuery 整体架构图


<!--more-->
![image](https://raw.githubusercontent.com/chokcoco/jQuery-/master/mindMap/jQuery%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84.png)

## jQuery的主要点：

[关于jQuery的整体分析](http://www.cnblogs.com/coco1s/p/5261646.html)

对于源码的分析：很重要的一点是，摒弃面向过程的思维方式，不要刻意去追求从上至下每一句都要在一开始弄明白。很有可能一开始你在一个奇怪的方法或者变量处卡壳了，很想知道这个方法或变量的作用，然而可能它要到几千行处才被调用到。如果去追求这种逐字逐句弄清楚的方式，很有可能在碰壁几次之后阅读的积极性大受打击


关于模块之间，最可能发生的就是变脸冲突，因此，代码要求高内聚、低耦合，尽量暴露少的变量给外界，或者进行检查。

ES5中使用立即执行匿名函数作为模块

jQuery中最基本有selector event  animate等模块

#### 亮点1jQuery每次调用不用new
```
jQuery.fn.init.prototype = jQuery.fn = jQuery.prototype = $ ;
```
new jQuery.fn.init() 相当于 new $() ;
$() 返回的是 new jQuery.fn.init()和 new $()是相同的，所以我们可以无 new 实例化 jQuery 对象。
 

#### 在JavaScript中函数是没有重载的概念
但是却可以实现类似重载的最终效果：就是对arguments参数的length进行分析，然后函数里面进入不同的返回函数，如 attr()实现了get和set的方法

在jQuery中实现了9中不同的重载场景：
```
JQuery(element)  //传入单个DOM
jQuery(elementArray) //传入DOM数组
jQuery([selector,[context]]) // 接受一个字符串，其中包含了用于匹配元素集合的 CSS 选择器
jQuery() //传入空参数
jQuery(object) //传入js对象
jQuery(jQuery object) //传入jQuery对象
jQuery(callback) // 绑定一个回调函数（在DOM文档加载完成之后）

```
#### jQuery.fn.extend 与 jQuery.extend
extend是用来扩展jQuery方法，充分实现自定义。
虽然 jQuery.extend = jQuery.fn.extend = function() {}是同一个函数，但是由于this指向的作用域不同导致它们之间的差异。
1. 在 jQuery.extend() 中，this 的指向是 jQuery 对象(或者说是 jQuery 类)，所以这里扩展在 jQuery 上，调用拓展方法使用 **$.methodName()** methodName指拓展方法名，是拓展jquery类本身的静态方法

2. 在 jQuery.fn.extend() = jQuery.prototype.extend() 中，this 的指向是jQuery原型方法，也就是对象方法。调用时使用 **$().methodName()**，
是实例的方法，所有实例共享的

#### 把常用数组方法放在了局部变量里缓存

#### hook机制
对兼容性做最大处理，对于钩子（hook），简单来说，钩子就是适配器原理，或者说是表驱动原理，我们预先定义了一些钩子，在正常的代码逻辑中使用钩子去适配一些特殊的属性，样式或事件，这样可以让我们少写很多 else if 语句。或者可以理解为数据结构与算法中 **查表** 的方法。
```
(function(window, undefined) {
    var
        // 用于存储 hook的表（Map）
        class2type = {};
 
    // 运用了钩子机制，判断类型前，将常见类型打表，先存于一个 Hash 表 class2type 里边
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
 
    jQuery.extend({
        type: function(obj) {
            if (obj == null) {
                return String(obj);
            }
            // lass2type[core_toString.call(obj)]看看这个对象有没有这个属性
            // 利用事先存好的 hash 表 class2type 作精准判断
            // 这里因为 hook 的存在，省去了大量的 else if 判断
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[core_toString.call(obj)] || "object" :
                typeof obj;
        }
    })
})(window);
```
运用了[策略模式](https://en.wikipedia.org/wiki/Strategy_pattern)，结果保持在可控范围内。