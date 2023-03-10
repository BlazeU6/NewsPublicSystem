import React from 'react'
import {withRouter} from "react-router-dom"
import {connect} from "react-redux"
import { Layout,Dropdown, Space,Avatar  } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
    UserOutlined 
    } from '@ant-design/icons';

const { Header } = Layout;

const TopHeader = (props) => {

    //从token中获取用户名和角色名称
    const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))

    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer">
                {roleName}
                </a>
            ),
        },
        {
            key: '2',
            danger: true,
            label: (
                <a 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => quitHandle()}
                >
                退出登录
                </a>
            )
        }
    ];

    //退出登录的操作
    const quitHandle = () => {
        localStorage.removeItem("token")
        props.history.replace("/login")
    }

    return (
        <Header
            className="site-layout-background"
            style={{
                padding: "0 16px",
            }}
            >
            {/* 折叠侧边栏的图标 */}
            {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => props.changeCollapsed(),
            })}
            <div style={{
                    float:"right",
                    height:"100%",
                    textAlign:"center"
                }}>
                <p 
                    style={{
                        float:"left",
                        marginRight:"20px"
                    }}> 
                    欢迎 <span
                        style={{color:"#1890ff"}}>
                            {username}
                        </span> 回来
                </p>
                <Dropdown
                    menu={{
                    items,
                    }}
                    style={{
                        float:"right"
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Avatar shape="square" size="large" icon={<UserOutlined />} />
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        </Header>
    )
}


const mapStateToProps = (state) => {
    return {
        isCollapsed:state.collapsedReducer.isCollapsed
    }   
}
const mapDispatchToProps = {
    changeCollapsed:() => ({
        type:"change_Collapsed",
        //payLoad:
    })
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader));

