import React, { useEffect, useState,lazy,Suspense } from 'react'
import {Switch,Route, Redirect} from "react-router-dom"
import axios from 'axios'
import {Spin} from "antd"
import { connect } from 'react-redux'

const Home = lazy(() => import("../../views/NewsSandBox/Home"))
const UserList = lazy(() => import("../../views/NewsSandBox/User-manage/UserList"))
const RoleList = lazy(() => import("../../views/NewsSandBox/Right-manage/RoleList"))
const RightList = lazy(() => import("../../views/NewsSandBox/Right-manage/RightList"))
const NoPermison = lazy(() => import("../../views/NewsSandBox/NoPermison"))
const NewsAdd = lazy(() => import("../../views/NewsSandBox/News-manage/NewsAdd"))
const NewsDraft = lazy(() => import("../../views/NewsSandBox/News-manage/NewsDraft"))
const NewsCateGory = lazy(() => import("../../views/NewsSandBox/News-manage/NewsCateGory"))
const NewPreview = lazy(() => import("../../views/NewsSandBox/News-manage/NewPreview"))
const Audit = lazy(() => import("../../views/NewsSandBox/Audit-manage/Audit"))
const AuditList = lazy(() => import("../../views/NewsSandBox/Audit-manage/AuditList"))
const Published = lazy(() => import("../../views/NewsSandBox/Publish-manage/Published"))
const Sunset = lazy(() => import("../../views/NewsSandBox/Publish-manage/Sunset"))
const Unpublished = lazy(() => import("../../views/NewsSandBox/Publish-manage/Unpublished"))
const NewUpdate = lazy(() => import("../../views/NewsSandBox/News-manage/NewUpdate"))

//建立本地路由映射表
const LocalRouteMap = {
    "/home":Home,
    "/user-manage/list":UserList,
    "/right-manage/role/list":RoleList,
    "/right-manage/right/list":RightList,
    "/news-manage/add":NewsAdd,
    "/news-manage/draft":NewsDraft,
    "/news-manage/category":NewsCateGory,
    "/news-manage/preview/:id":NewPreview,
    "/news-manage/update/:id":NewUpdate,
    "/audit-manage/audit":Audit,
    "/audit-manage/list":AuditList,
    "/publish-manage/unpublished":Unpublished,
    "/publish-manage/published":Published,
    "/publish-manage/sunset":Sunset
}

function NewsRouter(props) {
    const [BackRouteList,setBackRouteList] = useState([])
    useEffect(()=>{
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res => {
            //合并rights和children两个表并存入状态
            setBackRouteList([
                ...res[0].data,
                ...res[1].data
            ])
        })},[])

    const checkRoute = (item) => {
        return (item.pagepermisson || item.routepermisson) && LocalRouteMap[item.key]
    }

    //获取当前登录用户的权限列表
    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }
    return (
        <Spin size="large" spinning={props.isLoading}>
            <Suspense fullback={<Spin size="large" spinning={props.isLoading}></Spin>}>
                <Switch>    
                    {
                        BackRouteList.map((item,index) => {
                            //检查是否有权限
                            if(checkRoute(item) && checkUserPermission(item)){
                                return <Route path={item.key} component={LocalRouteMap[item.key]} key={index} exact />
                            }
                            return null 
                        })
                    }
                    <Redirect from="/" to="/home" exact />
                    {
                        BackRouteList.length > 0  && <Route     path="*" component={NoPermison}/>
                    }
                </Switch>
            </Suspense>
        </Spin>
    )
}

const mapStateToProps = (state) => {

    return {
        isLoading:state.loadingReducer.isLoading
    }
}
export default connect(mapStateToProps)(NewsRouter)
