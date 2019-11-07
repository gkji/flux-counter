
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

function create(Base, options={}) {
    
    // options
    const realOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    }
    
    const calculateState = (state, maybeProps, maybeContext) => {
        const props = realOptions.withProps ? maybeProps : undefined
        const context = realOptions.withContext ? maybeContext : undefined
        return Base.calculateState(state, props, context)
    }
    
    const getStores = (maybeProps, maybeContext) => {
        const props = realOptions.withProps ? maybeProps : undefined;
        const context = realOptions.withContext ? maybeContext : undefined;
        return Base.getStores(props, context)
    }
    
    
    // 为什么会有 context 参数
    class ContainerClass extends Base {
        constructor(props, context) {
            super(props, context)
            this._subscriptions = new FluxContainerSubscripts()
            // 设置 stores
            this._subscriptions.setStores(getStores(props))
            // 注册 subscription 的回调
            this._subscriptions.addListener(() => {
                this.setState((prevState, currentProps) => {
                    return calculateState(prevState, currentProps, context)
                })
            })
            
            // ?
            const calculatedState = calculateState(undefined, props, context)
            this.state = {
                // TODO delete ?
                ...(this.state || {}),
                ...calculatedState,
            }
        }
        
        componentWillReceiveProps(nextProps, nextContext) {
            if(super.componentWillReceiveProps) {
                super.componentWillReceiveProps(nextProps, nextContext)
            }
            
            if(realOptions.withProps || realOptions.withContext) {
                // update store and state
                this._subscriptions.setStores(getStores(nextProps, nextContext))
                this.setState(prevState => calculateState(prevState, nextProps, nextContext))
            }
        }
        
        componentWillUnmount() {
            if(super.componentWillUnmount) {
                super.componentWillUnmount()
            }
            
            this._subscriptions.reset()
        }
        
    }
    
    // TODO pure container
    
    // update container name
    const componentName = Base.displayName || Base.name
    ContainerClass.displayName = `FluxContainer(${componentName})`
    return ContainerClass
    
}

export const Container = { create }