---
title: Hexo next 配置个人博客
date: 2017-08-14 
categories: Hexo
tags: [Hexo,经验]
---
[Hexo](https://hexo.io/)或者[Hexo GitHub](https://github.com/hexojs/hexo/issues)是相关介绍

参考了这篇文章[利用 hexo + Gitpage 开发自己的博客](http://cherryblog.site/Use-Gitpagehexo-to-develop-their-own-blog.html)

<!--more-->
####  注意点
#####     关于语言设置乱码

在 Hexo 中有两份主要的配置文件，其名称都是 _config.yml。 其中，一份位于站点根目录下，主要包含 Hexo 本身的配置；另一份位于主题目录下，这份配置由主题作者提供，主要用于配置主题相关的选项。

为了描述方便，在以下说明中，将前者称为 站点配置文件， 后者称为 主题配置文件。

需要在**站点配置文件和主题配置文件**中均设置language为

``` bash
language: zh-Hans
```
注意：languag与zh-Hans之间的空格不能省略

####  hexo的Next创建tags

#####  1, 新建一个页面，命名为tags。命令如下：

```
  hexo new page "tags"
```
	
在myBlog/source下会新生成一个新的文件夹tags ，在该文件夹下会有一个index.md文件

#####  2. 编辑tags文件夹下的index.md
```
title: tags
date: 2017-07-10 16:36:26
type: "tags"

```
#####  3. 在菜单中添加链接。编辑主题的 themes/next/_config.yml ，添加tags到menu中，如下:
```
menu:
home: /
archives: /archives/
categories: /categories/
tags: /tags/
```

#### 4.绑定域名

购买[域名](https://account.aliyun.com/login/login.htm?oauth_callback=http://netcn.console.aliyun.com/core/domain/tclist)，我是在万网购买的，可以申请到国际域名，免去了备案的繁杂过程。
1. 在 Hexo\source 文件夹里新建一个名为 CNAME 的文件（可以新建文本，然后把txt去掉），用文本编辑器打开，添加内容 yourwebsite.com （你的个人域名 ）。
2. 手动在万网上解析，github page提供的IP：

    192.30.252.153

    192.30.252.154
    
对应：A 解析对应192.30.252.153 

#### 5.主题优化
Next主题很美观，个人也非常喜欢，但是一点令我们烦恼的就是主题加载的特别缓慢，那怎么优化呢？请参考博文，作者已经总结的非常详细了！

[使用gulp精简hexo博客代码]()


####  6.[为NexT主题添加文章阅读量统计功能](https://notes.wanghao.work/2015-10-21-%E4%B8%BANexT%E4%B8%BB%E9%A2%98%E6%B7%BB%E5%8A%A0%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E9%87%8F%E7%BB%9F%E8%AE%A1%E5%8A%9F%E8%83%BD.html#%E9%85%8D%E7%BD%AELeanCloud)


#### 7.关于分支管理博客的功能
可以参考[博客](http://crazymilk.github.io/2015/12/28/GitHub-Pages-Hexo%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2/)