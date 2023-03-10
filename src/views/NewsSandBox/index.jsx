import React, { useEffect } from 'react'

import { Layout } from 'antd';
import NProgress  from 'nprogress';
import "nprogress/nprogress.css"
import TopHeader from "../../components/TopHeader"
import SideMenu from "../../components/SideMenu"
import NewsRouter from "../../router/NewsRouter"

import "./index.css"

const {  Content } = Layout; 

export default function NewsSandBox() {
    NProgress.start()
    useEffect(() => {
        NProgress.done()
    })

    return (
        <Layout >
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 600,
                    }}
                    >
                    <NewsRouter />
                </Content>
            </Layout>
        </Layout>
    )
}
