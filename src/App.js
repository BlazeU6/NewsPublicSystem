import Router from "./router"
import {Provider} from "react-redux"
//状态管理持久化
import {store,persistor} from "./redux/store"
import { PersistGate } from 'redux-persist/integration/react'
import "./App.css"

function App() { 
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router/>
      </PersistGate>
      
    </Provider>
  );
}

export default App;
