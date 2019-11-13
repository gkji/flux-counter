import {Dispatcher} from '../Dispatcher'

// Store 的基类
// 核心就是 _onDispatch 方法, 该方法将注册到 dispatcher
// 在 dispatch 之后, onDispatch 将调用 reduce 更新状态, 并触发 store change 事件
export class ReduceStore {
    constructor(dispatcher) {
        this._state = this.getInitialState()
        this.__className = this.constructor.name

        // 一个 dispatcher 用于监听 用户输入，触发 store 的数据更新
        this.__dispatcher = dispatcher

        // 用一个新的 dispatcher 来负责在 store 数据更新后，通知 container 更新 state
        this.__emitter = new Dispatcher()

        // 将 __onDispatch 注册为 dispatcher 的回调 返回callback id
        dispatcher.register(payload => {
            this.__onDispatch(payload)
        })
    }
    
    // 返回 store 的全部状态
    getState() {
        return this._state
    }

    // 比较两个 state 对象是否相同
    areEqual(one, two) {
        return one === two
    }
    
    // 在 store 初始化时注册为 dispatcher 的回调
    __onDispatch(action) {
        const startState = this._state
        const endState = this.reduce(startState, action)
        
        if(!this.areEqual(startState, endState)) {
            this._state = endState
            this.__emitter.dispatch(action)
        }
    }

    // 获取 emitter
    getEmitter() {
        return this.__emitter
    }
}

