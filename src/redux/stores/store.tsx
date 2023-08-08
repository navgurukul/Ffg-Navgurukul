import {routerMiddleware} from 'connected-react-router';
import {createLogger} from 'redux-logger';
import {applyMiddleware, compose, createStore} from "redux";
import getRootReducer from "../reducers";
import {createHashHistory} from 'history';

const configreStore = history => {
    let middlewares =[]
    let enhancers = []
    middlewares.push(routerMiddleware(history))
    const logger = createLogger()
    middlewares.push(logger)

    const composeEnhancers =
        typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            maxAge: 15,
            }): compose

    enhancers.push(applyMiddleware(...middlewares))

    const storeEnhancers = composeEnhancers(...enhancers)
    const store = createStore(getRootReducer(history),storeEnhancers)

    if(module.hot){
        module.hot.accept('../reducers',()=>{
            const getNextReducer = require('../reducers/index').default
            store.replaceReducer(getNextReducer(history))
        })
    }
    return store
}

export const history = createHashHistory()
export const store = configreStore(history)
