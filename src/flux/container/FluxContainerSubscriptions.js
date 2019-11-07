// FluxContainerSubscriptions 用于组织一组 store 与 一个 container 的状态更新
class FluxContainerSubscriptions {
    constructor () {
        this._callbacks = []
        // this._storeGroup = null
        this._stores = null
        // 所有 store change 事件的回调句柄
        this.tokens = []

        this._dispatcher = null
        this._dispatchToken = null
    }
    
    setStores (stores) {
        this._stores = stores
        
        let changed = false
        // 注册所有 store 的 change 事件
        this._tokens = stores.addListener(() => {
            changed = true
        })
        
        // 所有 store 更新完之后的回调
        const callCallbacks = () => {
            if (changed) {
                this._callbacks.forEach(fn => fn())
                changed = false
            }
        }
        
        // 在 store change 之后

        this._dispatcher = stores.getDispatcher()
        // store 的 dispatch token
        this._dispatchToken = this._dispatcher.register(payload => {
            callCallbacks()
        })
    }
    
    addListener (fn) {
        this._callbacks.push(fn)
    }
}

export default FluxContainerSubscriptions

