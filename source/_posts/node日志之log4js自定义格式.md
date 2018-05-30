---
title: node中使用log4js自定义日志文件
date: 2018-05-31
categories: node
tags: [node,log4js]
---

[log4js-node的API](https://log4js-node.github.io/log4js-node/layouts.html)
[]()

<!--more-->


#### 用法
https://github.com/log4js-node/log4js-api

the basic log functions (trace, debug, info, warn, error, fatal)



LogEvent - a log event has a timestamp, a level, and optional category, data, and context properties. When you call logger.info('cheese value:', edam) the logger will create a log event with the timestamp of now, a level of INFO, a category that was chosen when the logger was created, and a data array with two values (the string ‘cheese value:’, and the object ‘edam’), along with any context data that was added to the logger.


```
log4js.addLayout('json', function(config) {
  return function(logEvent) { return JSON.stringify(logEvent) + config.separator; }
});
```
了解v8引擎的问题 —— https://github.com/v8/v8/wiki/Stack%20Trace%20API

#### 









#### 参考文献

[]()