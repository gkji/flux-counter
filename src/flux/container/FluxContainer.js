

// Base 是一个 ReactComponent, 有 getStores 和 calculateState 两个静态方法
// getStores 返回 FluxStore 的数组
// getState 返回 state 对象
// create 创建了 Base 的子类, 通过子类调用父类的生命周期函数

function create(Base) {
    class ContainerClass extends Base {
        constructor(props, context) {
            super(props, context)
        
            const store = Base.getStores(props);
            const dispatcher = store.getDispatcher()
            dispatcher.register(payload => {
                this.setState((prevState) => {
                    return Base.calculateState(prevState)
                })
            })

            const calculatedState = Base.calculateState()
            this.state = {
                ...(this.state || {}),
                ...calculatedState,
            }
        }
    }
     
    return ContainerClass
    
}

export const Container = { create }