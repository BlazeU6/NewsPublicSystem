import React, { useState,useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    KeyOutlined,
    DatabaseOutlined,
    SearchOutlined,
    UploadOutlined
    } from '@ant-design/icons';
import "./index.css"
import axios from 'axios';
import {connect} from "react-redux"


const {  Sider } = Layout;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
        };
}
// const items = [
//     getItem('首页', '/home', <PieChartOutlined />),
//     getItem('用户管理', 'sub1', <MailOutlined />, [
//         getItem('用户列表', '/user-manage/list'),
//     ]),
//     getItem('权限管理', 'sub2', <AppstoreOutlined />, [
//         getItem('角色列表', '/right-manage/role/list'),
//         getItem('权限列表', '/right-manage/right/list'),
//     ]),
//     getItem('新闻管理', '5', <PieChartOutlined />),
//     getItem('审核管理', '6', <PieChartOutlined />),
//     getItem('发布管理', '7', <PieChartOutlined />),
// ]

function SideMenu(props) {
    // const [collapsed, setCollapsed] = useState(false);
    
    const [menuList,setMenuList] = useState([])
    //从本地获取当前登录用户的权限列表
    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        axios.get("/rights?_embed=children")
        .then(res => {
            setMenuList(res.data)
        })
    },[])
    const checkPagePermisson = (item) => {
        //rights是当前登录用户的权限列表
        return  item.pagepermisson  && rights.includes(item.key)
    }

    const iconList = {
        "/home":<HomeOutlined />,
        "/user-manage":<UserOutlined />,
        "/right-manage":<KeyOutlined />,
        "/news-manage":<DatabaseOutlined />,
        "/audit-manage":<SearchOutlined />,
        "/publish-manage":<UploadOutlined />
    }

    const renderMenu = (menus) => {
        return menus.map(item => {
            if(item.children?.length > 0 && checkPagePermisson(item)){
                return getItem(item.title,item.key,iconList[item.key],item.children.map(item => {
                    if(checkPagePermisson(item)){
                        return getItem(item.title,item.key)
                    }
                }))
            }else {
                return checkPagePermisson(item) && getItem(item.title,item.key,iconList[item.key])
            }
        })
    }

    const defaultSelectedKeys = [props.location.pathname]
    const defaultOpenKeys = ["/" + defaultSelectedKeys[0].split("/")[1]]

    return (
            <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
                <div style={{display:"flex",height:"100%",flexDirection:"column"}}>
                    <div className="logo">新闻发布管理系统</div>
                    <div style={{flex:1,overflow:"auto"}}>
                        <Menu
                            selectedKeys={defaultSelectedKeys}
                            defaultOpenKeys={defaultOpenKeys}
                            mode="inline"
                            theme="light"
                            // inlineCollapsed={collapsed}
                            items={renderMenu(menuList)}
                            onClick={(event) => {props.history.push(event.key)}}
                        />
                    </div>
                </div>
            </Sider>
    );
}
const mapStateToProps = (state) => {
    return {
        isCollapsed:state.collapsedReducer.isCollapsed
    }   
}

// const mapDispatchToProps = () => {
    
// }

export default connect(mapStateToProps)(withRouter(SideMenu))
