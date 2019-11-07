
import FluxContainerSubscripts from './FluxContainerSubscriptions'

const DEFAULT_OPTIONS = {
    pure: true,
    withProps: false,
    withContext: false,
}

// Base 是一个 ReactComponent, 有 getStores 和 calculateState 两个静态方法
// getStores 返回 FluxStore 的数组
// getState 返回 state 对象
// create 创建了 Base 的子类, 通过子类调用父类的生命周期函数

function create(Base) {
    
    const realOptions = {
      ...DEFAULT_OPTIONS,
    }
    
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
            this._subscriptions = new FluxContainerSubscripts()
            // 设置 stores
            const stores = getStores(props);
            this._subscriptions.setStores(stores)
            // 注册 subscription 的回调
            this._subscriptions.addListener(() => {
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
        
        componentWillReceiveProps(nextProps, nextContext) {
            // if(super.componentWillReceiveProps) {
            //     super.componentWillReceiveProps(nextProps, nextContext)
            // }
            
        }
        
        componentWillUnmount() {
            // if(super.componentWillUnmount) {
            //     super.componentWillUnmount()
            // }
        }
        
    }
    
    
    // update container name
    const componentName = Base.displayName || Base.name
    ContainerClass.displayName = `FluxContainer(${componentName})`
    return ContainerClass
    
}

export const Container = { create }