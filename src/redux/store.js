import {createStore,combineReducers} from "redux"
import collapsedReducer from "./reducers/collapsedReducer"
import loadingReducer from "./reducers/loadingReducer"
//引入redux-devtools-entension
import {composeWithDevTools} from "redux-devtools-extension"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//合并所有的reducer
const allReducers = combineReducers({
    collapsedReducer,
    loadingReducer
})

const persistConfig = {
    key: 'root',
    storage,
    blacklist:['loadingReducer']
}
const persistedReducer = persistReducer(persistConfig, allReducers)

const store = createStore(persistedReducer,composeWithDevTools())
const persistor  = persistStore(store)

export {
    store,
    persistor
}