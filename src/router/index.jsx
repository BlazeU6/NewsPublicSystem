import { BrowserRouter,Route,Switch,Redirect } from "react-router-dom";
import React,{lazy,Suspense} from 'react'
import Loading from "../components/Loading"
import NewsSandBox from "../views/NewsSandBox";


const Login = lazy(()=>import("../views/Login"))
const Detail = lazy(()=>import("../views/NewsVisitor/Detail"))
const NewsHome = lazy(()=>import("../views/NewsVisitor/NewsHome"))
// const NewsSandBox = lazy(()=>import("../views/NewsSandBox"))

export default function Router() {
    
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading/>}>
                <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/news" component={NewsHome}/>
                        <Route path="/detail/:id" component={Detail}/>
                        <Route path="/" render={() => 
                            localStorage.getItem("token") ?
                            <NewsSandBox/> :
                            <Redirect to="/login"/>
                        } />
                </Switch>   
            </Suspense>
        </BrowserRouter>
    )
}
