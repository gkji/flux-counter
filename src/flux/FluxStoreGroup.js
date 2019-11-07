function _getUniformDispatcher(stores, Dispatcher) {
    // 所有 store 应该使用 同一个 dispatcher
    const dispatcher = stores.getDispatcher()
    return dispatcher
}

// FluxStoreGroup 类组织 store 的执行顺序
// 每次 dispatch 时, 先对 stores 指定的一组 store 进行更新, 然后执行 callback
class FluxStoreGroup {
    constructor(stores, callback) {
        this._dispatcher = _getUniformDispatcher(stores)
        
        // store 的 dispatch token
        this._dispatchToken = this._dispatcher.register(payload => {
            callback()
        })
    }
    
    release() {
        this._dispatcher.unregister(this._dispatchToken)
    }
}

export default FluxStoreGroup

