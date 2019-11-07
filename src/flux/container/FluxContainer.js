

// Base 是一个 ReactComponent, 有 getStores 和 calculateState 两个静态方法
// getStores 返回 FluxStore 的数组
// getState 返回 state 对象
// create 创建了 Base 的子类, 通过子类调用父类的生命周期函数

function create(Base) {

    
    const calculateState = (state) => {
        return Base.calculateState(state)
    }
    
    const getStores = () => {
        return Base.getStores()
    }
    
    
    // 为什么会有 context 参数
    class ContainerClass extends Base {
        constructor(props, context) {
            super(props, context)
            this._callbacks = []
            this._store = null

            const stores = getStores(props);

            this.setStores(stores)
            // 注册 subscription 的回调

            this.addListener(() => {
                this.setState((prevState, currentProps) => {
                    return calculateState(prevState, currentProps, context)
                })
            })
            
            const calculatedState = calculateState()
            this.state = {
                ...(this.state || {}),
                ...calculatedState,
            }
        }

        addListener (fn) {
            this._callbacks.push(fn)
        }

        setStores (store) {
            this._store = store
            
            let changed = false
            // 注册所有 store 的 change 事件
            store.addListener(() => {
                changed = true
            })
            
            // 所有 store 更新完之后的回调
            const callCallbacks = () => {
                if (changed) {
                    this._callbacks.forEach(fn => fn())
                    changed = false
                }
            }
            
            const dispatcher = store.getDispatcher()
            dispatcher.register(payload => {
                callCallbacks()
            })
        }
    }


    
    
    // update container name
    const componentName = Base.displayName || Base.name
    ContainerClass.displayName = `FluxContainer(${componentName})`
    return ContainerClass
    
}

export const Container = { create }