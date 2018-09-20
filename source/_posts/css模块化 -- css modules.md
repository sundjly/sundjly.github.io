---
title: css模块化 -- css module
date: 2018-7-14 
categories: canvas
tags: [css module,react]
---
### 导读：主要介绍了css module在项目中的实践，创建了全局的css样式以及局部的css样式，这篇博客不是介绍css module的原理，而是具体实现
<!--more-->
### 项目实践--使用less
项目使用create-react-app构建，通过
```
npm run eject
```
把webpack的配置弹出来，同时使用less预处理，当然解决css冲突也可以用less嵌套的写法解决，但是嵌套太多也不利于后期维护，关于less嵌套：

    1、过渡的嵌套会导致很多问题发生，使代码变得更复杂，而且太过依赖于HTML结构，这样后面要覆盖样式需要依赖于"!important"，而这种方式又是我们尽量避免使用的一种
    
    2、嵌套层级不应该超过三层
    
    3、嵌套层级编译出来的CSS，要确保其简洁，可重用
    
    4、使用嵌套很有意义，但并不意味着无限级的嵌套

#### 启用css modules
只需在webpack中生产和开发环境中使用css-loader，下面为less中使用

```
//@Lynn 这里我开启自己编写的less文件的css modules功能 除了node_modules库中的less
//也就是可以过滤掉antd库中的样式
{
  test: /\.less$/,
  exclude: [/node_modules/],
  use: [
      require.resolve('style-loader'),
      {
          loader: require.resolve('css-loader'),
          options: {
              modules: true,
              localIndexName:"[name]__[local]___[hash:base64:5]"
          },
      },
      {
          loader: require.resolve('less-loader'), // compiles Less to CSS
      },
  ],
},
```

#### 对已有项目进行优化
如果不是一个新的项目，那么可以只对后缀.module.css进行处理--这样就不会影响之前的项目：

1. 对于局部css   采用[name]. module.[less | css]，

```
这个是在config/webpack.config.dev.js里面定义了
{
test: /\.less$/,
use: [
  require.resolve('style-loader'),
  ({resource}) => ({
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: /\.module\.less/.test(resource),
      localIdentName: '[name]__[local]___[hash:base64:5]',
    },
  }),
  {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9', // React doesn't support IE8 anyway
          ],
          flexbox: 'no-2009',
        }),
      ],
    },
  },
  {
    loader: require.resolve('less-loader'),
    options: {
      modifyVars: theme,
    },
  },
],
},
```
2. 定义全局样式，直接在css|less文件加入:global：

```
/* 定义多个全局样式 */
1.	:global {
2.	  .link {
3.	    color: green;
4.	  }
5.	  .box {
6.	    color: yellow;
7.	  }
8.	}
```


3. 对于组件的引入

```
/* components/Button.css */
.base { /* 所有通用的样式 */ }

.normal {
  composes: base;
  /* normal 其它样式 */
}

.disabled {
  composes: base;
  /* disabled 其它样式 */
}
import styles from './Button.css';

buttonElem.outerHTML = `<button class=${styles.normal}>Submit</button>`
```


4. 对于一般的react项目中使用：

```
//dialog.css文件
.root {}
.confirm {}
.disabledConfirm {}


// Dialog组件
import classNames from 'classnames';
import styles from './dialog.css';
// npm i -S classnames


export default class Dialog extends React.Component {
  render() {
    const cx = classNames({
      [styles.confirm]: !this.state.disabled,
      [styles.disabledConfirm]: this.state.disabled
    });

    return <div className={styles.root}>
      <a className={cx}>Confirm</a>
      ...
    </div>
  }
}
```

5. 在社区项目里面的实践

```
// 项目里面的实践
import styles from './Buildingtree.module.less';
import classnames from 'classnames';
treeNode.map((val, index) => {
  const liLevel= `li-${val.currentLevel}`;
  const liStyle = classnames({
    [styles['li-active']]: (index == activeLi),
    liLevel
  });
  return <li className={liStyle}></li>;
  }
```

### css modules的局限：
    1.	class名必须是驼峰形式，否则不能正常在js里使用 styles.table 来引用 对此的解决方法
  
```
className={styles['tree-component-header']

```
    2.	由于css模块化是默认，当你希望使用正常的全局css时，需要通过:local 和 :global 切换，不方便
    3.	所有的 className 都必须使用 {style.className} 的形式



### 参考文献
来自于：
1. [如何在react中使用antd+less+css modules](https://www.jianshu.com/p/51ff1c8be301)

2. [具体使用 结合classnames](https://zhuanlan.zhihu.com/p/20495964)