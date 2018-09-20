---
title: vue中 Error in mounted hook
date: 2017-03-14 
categories: 经验
tags: [工作,经验]
---


在vue的项目中出现了以下错误：
```
Error in mounted hook: "TypeError: __WEBPACK_IMPORTED_MODULE_0__assets_swiper_js__.default is not a constructor"
```
<!--more-->

TypeError: __WEBPACK_IMPORTED_MODULE_0__assets_swiper_js__.default is not a constructor
根据检查发现是引入swiper.js导致的问题，导致swiper解析错误（放在了文件src中）

 

解决方法，是把静态的文件放在static的文件夹下面，即
```
import Swiper from '../../static/swiper.js'
import '../assets/css/swiper.css'
console.log(Swiper)
export default {}
```
这样就能打印到结果。分析，swiper.js是不需要经过webpack编译的，不能放在src路径下   npm的下载中不包含swiper的