---
title: Reducer学习入门
date: 2018-1-28 
categories: React
tags: [javaScript,React]
---

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。

可以让你构建一致化的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。不仅于此，它还提供 超爽的开发体验，比如有一个时间旅行调试器可以编辑后实时预览。

Redux 除了和 React 一起用外，还支持其它界面库。
它体小精悍（只有2kB）且没有任何依赖。

<!--more-->


#### 参考：
http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html

#### 产生
React 只是 DOM 的一个抽象层，并不是Web应用的完整解决方案。有两个方面，它没涉及。

- 代码结构
- 组件之间的通信

对于大型的复杂应用来说，这两方面恰恰是最关键的。因此，只用 React 没法写大型应用。这时就要通过redux来进行处理。

#### 适用范围
当你的开发运用中：
- 用户的使用方式复杂
- 不同身份的用户有不同的使用方式（比如普通用户和管理员）
- 多个用户之间可以协作
- 与服务器大量交互，或者使用了WebSocket
- View要从多个来源获取数据

上面这些情况才是 Redux 的适用场景：多交互、多数据源。

从组件角度看，如果你的应用有以下场景，可以考虑使用 Redux。

- 某个组件的状态，需要共享
- 某个状态需要在任何地方都可以拿到
- 一个组件需要改变全局状态
- 一个组件需要改变另一个组件的状态

发生上面情况时，如果不使用Redux或者其他状态管理工具，不按照一定规律处理状态的读写，代码很快就会变成一团乱麻。你需要一种机制，可以在同一个地方查询状态、改变状态、传播状态的变化。

#### 设计思想
Redux 的设计思想很简单，就两句话。

（1）Web 应用是一个状态机，视图与状态是一一对应的。

（2）所有的状态，保存在一个对象里面。

#### 基本概念
##### Store 
就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。

Redux 提供createStore这个函数，用来生成 Store。

```
import { createStore } from 'redux';
const store = createStore(fn);
```
上面代码中，createStore函数接受另一个函数作为参数，返回新生成的 Store 对象。

##### State
对象包含所有数据。如果想得到某个时点的数据，就要对 Store 生成快照。这种时点的数据集合，就叫做 State。

当前时刻的 State，可以通过store.getState()拿到。

```
import { createStore } from 'redux';
const store = createStore(fn);

const state = store.getState();
```
Redux 规定， 一个 State 对应一个 View。只要 State 相同，View 就相同。你知道 State，就知道 View 是什么样，反之亦然。

##### Action
State 的变化，会导致 View 的变化。Action 就是 View 发出的通知，表示 State 应该要发生变化了。

Action 是一个对象。其中的type属性是必须的，表示 Action 的名称。其他属性可以自由设置，社区有一个[规范](https://github.com/acdlite/flux-standard-action)可以参考。

```
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
};
```
上面代码中，Action 的名称是ADD_TODO，它携带的信息是字符串Learn Redux。

可以这样理解，Action 描述当前发生的事情。改变 State 的唯一办法，就是使用 Action。它会运送数据到 Store。

##### Action Creator
View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦。可以定义一个函数来生成 Action，这个函数就叫 Action Creator。

```
const ADD_TODO = '添加 TODO';

function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

const action = addTodo('Learn Redux');
```
上面代码中，addTodo函数就是一个 Action Creator。

##### store.dispatch()

**store.dispatch()是 View 发出 Action 的唯一方法。**

```
import { createStore } from 'redux';
const store = createStore(fn);

store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
});
```
上面代码中，store.dispatch接受一个 Action 对象作为参数，将它发送出去。

结合 Action Creator，这段代码可以改写如下。

```
store.dispatch(addTodo('Learn Redux'));
```

##### Reducer
Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。

Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

```
const reducer = function (state, action) {
  // ...
  return new_state;
};
```
整个应用的初始状态，可以作为 State 的默认值。下面是一个实际的例子。
```
const defaultState = 0;
const render = (state = defaultState, action) => {
    switch(action.type) {
        case 'ADD' :
            return state + action.payload;
        default:
        return state;
    }
};

cosnt state = reduxer(1, {
type: 'ADD',
payload: 2
});
```
上面代码中，reducer函数收到名为ADD的 Action 以后，就返回一个新的 State，作为加法的计算结果。其他运算的逻辑（比如减法），也可以根据 Action 的不同来实现。

实际应用中，Reducer 函数不用像上面这样手动调用，**store.dispatch方法会触发 Reducer 的自动执行。，**为此，Store 需要知道 Reducer 函数，做法就是在生成 Store 的时候，将 Reducer 传入createStore方法。

```
import { createStore} from 'redux';
const store = createStore(reducer);
```
上面代码中，createStore接受 Reducer 作为参数，生成一个新的 Store。以后**每当store.dispatch发送过来一个新的 Action，就会自动调用 Reducer，得到新的 State**。

##### 纯函数
Reducer 函数最重要的特征是，它是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出。

纯函数是函数式编程的概念，必须遵守以下一些约束。

- 不得改写参数
- 不能调用系统 I/O 的API
- 不能调用Date.now()或者Math.random()等不纯的方法，因为每次会得到不一样的结果

由于 Reducer 是纯函数，就可以保证同样的State，必定得到同样的 View。但也正因为这一点，Reducer 函数里面不能改变 State，必须返回一个全新的对象，请参考下面的写法。

```
// State 是一个对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
}

// State 是一个数组
function reducer(state, action) {
  return [...state, newItem];
}
```
最好把 State 对象设成只读。你没法改变它，**要得到新的State，唯一办法就是生成一个新对象。这样的好处是，任何时候，与某个 View 对应的 State 总是一个不变的对象。，**

##### store.subscribe()  

- [ ] ？有疑惑

Store 允许使用store.subscribe方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

```
import { createStore } from 'redux';
const store = createStore(reducer);

store.subscribe(listener);
```
显然，只要把 View 的更新函数（对于 React 项目，就是组件的render方法或setState方法）放入listen，就会实现 View 的自动渲染。

store.subscribe方法返回一个函数，调用这个函数就可以解除监听。

```
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

unsubscribe();
```
#### Store 的实现
Store 提供了三个方法。

- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器。
```
import { createStore } from 'redux';
let { subscribe, dispatch, getState } = createStore(reducer);
```
createStore方法还可以接受第二个参数，表示 State 的最初状态。这通常是服务器给出的。

```
let store = createStore(todoApp, window.STATE_FROM_SERVER)
```
上面代码中，window.STATE_FROM_SERVER就是整个应用的状态初始值。注意，如果提供了这个参数，它会覆盖 Reducer 函数的默认初始值。

下面是createStore方法的一个简单实现，可以了解一下 Store 是怎么生成的。
```
const createStore = (reducer) =>{
    let state;
    let listeners = [];
    const getState = () => state;
    
    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener=> listener());
    };
    const sucscribe = (listener) => {
        listeners.push(listener);
        return ()=> {
            listeners = listeners.filter(l => l !== listener);
        }
    };
    dispatch();
    return {getState, dispatch, subscribe};
}
```
#### Reducer 的拆分
Reducer 函数负责生成 State。由于整个应用只有一个 State 对象，包含所有数据，对于大型应用来说，这个 State 必然十分庞大，导致 Reducer 函数也十分庞大。

如下面的粒子：
```
const chatReducer = (state = default ,action ={}) => {
    const { type, payload } = action;
    switch(type) {
        case ADD_CHAT:
            return Object.assign({}, state, {
                chatLog: state.chatLog.concat(payload)
            });
        case CHANGE_STATUS: 
            return Object.assign({}, state, {
                statusMessage: payload
            });
        case CHANGE_USERNAME:
            return Object.assign({}, state, {
                userName: payload
            });
        default: return state;
        
    }
}
```
上面的代码中，三种action分别改变state的三个属性
- ADD_CHAT：chatLog属性
- CHANGE_STATUS：statusMessage属性
- CHANGE_USERNAME：userName属性

这三个属性之间没有联系，这提示我们可以把reducer函数拆分，不同的函数负责处理不同属性，最终合并成一个reducer
```
const chatReducer = (state = defaultState, action = {}) => {
    return {
        chatLog: chatLog(state.chatLog, action),
        statusMessage: statusMessage(state.statusMessage, action),
        userName: userName(state.userName, action)
    }
};
```
上面代码中，reducer函数被拆分三个函数，每个负责对应的属性。

这样一拆，Reducer 就易读易写多了。而且，这种拆分与 React 应用的结构相吻合：一个 React 根组件由很多子组件构成。这就是说，子组件与子 Reducer 完全可以对应。

Redux 提供了一个combineReducers方法，用于 Reducer 的拆分。你只要定义各个子 Reducer 函数，然后用这个方法，将它们合成一个大的 Reducer。

combineReducers()做的就是产生一个整体的 Reducer 函数。该函数根据 State 的 key 去执行相应的子 Reducer，并将返回结果合并成一个大的 State 对象。

下面是combineReducer的简单实现。

```
const combineReducers = reducers => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      },
      {} 
    );
  };
};
```
你可以把所有子 Reducer 放在一个文件里面，然后统一引入。

一般都是这样做

```
import { combineReducers } from 'redux'
import * as reducers from './reducers'

const reducer = combineReducers(reducers)
````
#### 工作流程
![image](http://www.ruanyifeng.com/blogimg/asset/2016/bg2016091802.jpg)


首先，用户发出 Action。

```
store.dispatch(action);
```
然后，Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action。 Reducer 会返回新的 State 。

```
let nextState = todoApp(previousState, action);
```
State 一旦有变化，Store 就会调用监听函数。

```
// 设置监听函数
store.subscribe(listener);
listener可以通过store.getState()得到当前状态。如果使用的是 React，这时可以触发重新渲染 View。


function listerner() {
  let newState = store.getState();
  component.setState(newState);   
}
```
#### 一个例子——计数器的实现
```
const Counter = ({ value, onIncrement, onDecrement }) => (
    <div>
    <h1>{ value }</h1>
    <button onClick = {onIncrement}>+</button>
    <button onClick = {onDecrement}>-</button>
);

const reducer = (state = 0, action) => {
    switch(action.type){
        case 'INCREMENT': return state +1 ;
        case 'DECREMENT': return state -1 ;
        default :return state;
    }
};

const store = createStore(reducer);

const render = () => {
    ReactDOM.render(
    <Counter 
        value={store.getState()}
        onIncrement={() => store.dispatch({type: 'INCREMENT'})
        onDecrement={() => store.dispatch({type: 'DECREMENT'})}
    />,
    document.getElmentById('root')
    )
};

render();
store,subscribe(render);
```

