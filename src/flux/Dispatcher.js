
export class Dispatcher {
    constructor() {
        this._callbacks = {}
        this._lastId = 1
    }
    
    register(callback) {
        const id = `ID_${this._lastId++}`
        this._callbacks[id] = callback
        return id
    }
    
    // 取消注册
    unregister(id) {
        delete this._callbacks[id]
    }
    
    
    // 将事件分发到所有回调
    dispatch(payload) {
        for(let id in this._callbacks) {
            this._callbacks[id](payload)
        }
    }
}
