---
title: chromedriver安装出现错误
date: 2017-07-14 
categories: 经验
tags: [工作,经验]
---

在vue的项目里面copy别人package.json  运行时出现了如下的错误
```
（error chromedriver@2.33.2 install: `node install.js`）
```
<!--more-->
```
2746 verbose node v8.9.0
2747 verbose npm  v5.6.0
2748 error code ELIFECYCLE
2749 error errno 1
2750 error chromedriver@2.33.2 install: `node install.js`
2750 error Exit status 1
2751 error Failed at the chromedriver@2.33.2 install script.
2751 error This is probably not a problem with npm. There is likely additional logging output above.
 ```

解决方法查看了[这里](https://github.com/vuejs/vue-router/issues/261#issuecomment-218618180)  ,然后看了下package.json，发现与我电脑里装的chromedriver版本不一致，导致出问题。

![image](/images/chrome.png)


可以执行：

```
npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
```
运行就好了，应该时国内限制吧（有知道的小伙伴  麻烦告诉以下）
 
```
PS D:\WebstormProjects\GitHub\vue-meituan> npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
 
> chromedriver@2.33.2 install D:\WebstormProjects\GitHub\vue-meituan\node_modules\chromedriver
> node install.js
 
Downloading http://cdn.npm.taobao.org/dist/chromedriver/2.33/chromedriver_win32.zip
Saving to C:\Users\Lenovo\AppData\Local\Temp\chromedriver\chromedriver_win32.zip
Received 786K...
Received 1570K...
Received 2353K...
Received 3137K...
Received 3925K...
Received 4125K total.
Extracting zip contents
Copying to target path D:\WebstormProjects\GitHub\vue-meituan\node_modules\chromedriver\lib\chromedriver
Done. ChromeDriver binary available at D:\WebstormProjects\GitHub\vue-meituan\node_modules\chromedriver\lib\chromedriver\chromedriver.exe
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.1.3 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
 
+ chromedriver@2.33.2
added 5 packages in 13.739s
PS D:\WebstormProjects\GitHub\vue-meituan>
```