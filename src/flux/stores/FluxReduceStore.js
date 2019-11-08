const {EventEmitter} = require('fbemitter')
// Store 的基类
// 核心就是 _onDispatch 方法, 该方法将注册到 dispatcher
// 在 dispatch 之后, onDispatch 将调用 reduce 更新状态, 并触发 store change 事件
export class FluxReduRceStore {
    constructor(dispatcher) {
        this._state = this.getInitialState()

        // 子类可用的属性
        this.__className = this.constructor.name
        
        this.__changed = false
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
        // TODO 应该对 changed 和 emitter 进行封装
        // before change
        this.__setChanged(false)
        
        // reduce state
        const startState = this._state
        // endState 不能是 undefined
        const endState = this.reduce(startState, action)
        
        // 更新状态: 更新状态的方式以 新状态 代替 旧状态
        // 通过 areEqual 可以改变更新方式
        if(!this.areEqual(startState, endState)) {
            this._state = endState
            this.__setChanged(true)
        }
        
        // 触发 change 事件
        if(this.hasChanged()) {
            this.__emitChange()
        }
    }

    // 获取 dispatcher
    getDispatcher() {
        return this.__dispatcher
    }
    
    // 判断 store 在最近的 dispatch 后是否已更新
    hasChanged() {
        return this.__changed
    }

    __setChanged(bool) {
        this.__changed = bool
    }
    
    __emitChange() {
        this.__emitter.emit(this.__changeEvent)
    }
    
    
    // 注册 change 事件
    // 返回 token 对象, token.remove() 将移除注册
    addListener(callback) {
        return this.__emitter.addListener(this.__changeEvent, callback)
    }
}

