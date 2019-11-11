const {EventEmitter} = require('fbemitter')
// Store 的基类
// 核心就是 _onDispatch 方法, 该方法将注册到 dispatcher
// 在 dispatch 之后, onDispatch 将调用 reduce 更新状态, 并触发 store change 事件
export class ReduceStore {
    constructor(dispatcher) {
        this._state = this.getInitialState()
        this.__className = this.constructor.name
        
        this.__changeEvent = 'change'
        this.__dispatcher = dispatcher
        this.__emitter = new EventEmitter()
        
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
            this.__emitChange()
        }
    }

    // 获取 dispatcher
    getDispatcher() {
        return this.__dispatcher
    }
    
    __emitChange() {
        this.__emitter.emit(this.__changeEvent)
    }    

}

