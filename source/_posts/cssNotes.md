---
title: css的优先级笔记
date: 2017-11-14 
categories: css
tags: [css,读书笔记]
---


来自[《精彩绝伦的css》](https://book.douban.com/subject/10793898/)
<!--more-->

1. css的优先级我们是用选择器的“特殊程度”：

    每个元素的描述贡献（如div，ul）为0,0,0,1
    每个类（class）、伪类（如:hover）或者属性描述符贡献0,0,1,0
    每个ID描述符贡献0,1,0,0
2. 数字左边的位数更大。一般可以这样认为：

    行内样式>ID>类、伪类、伪元素>元素（label）
    ! important无视上面的规则--这是重要声明，优先级最高
    当有两个! important冲突时，又要参照标准1
    3.在css中选择性覆盖简写属性，如
```
border:3px dotted black;
border-left-color:red;
```


可以实现一个3条边黑色。左边为红色的点边框

然而像下面写就不会出现一个3条边黑色。左边为红色的点边框。
    
    
```
border-left-color:red;
border:3px dotted black;
```
这是因为后面的样式会覆盖前面的样式（对于相同元素），

所以当使用这种选择性覆盖时，确保用来覆盖简写属性的属性出现在简写属性之后。

4. 关于多重样式优先级：

一般情况下，优先级如下：

**内联样式）Inline style > （内部样式）Internal style sheet >（外部样式）External style sheet > 浏览器默认样式**