import React, { useEffect,useState,useRef } from 'react'
import { Card, Col, Row,List,Avatar,Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined,FundViewOutlined,LikeOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from "echarts"
import _ from "lodash"

const { Meta } = Card;
export default function Home() {
    const [viewList,setViewList] = useState([])
    const [starList,setStarList] = useState([])
    //抽屉的开关状态
    const [drawOpen,setDrawOpen] = useState(false)
    const [pieChart,setPieChart] = useState(null)

    //柱状图
    const barRef = useRef(null)
    //饼图
    const pieRef = useRef()

    //获取新闻列表（按浏览量降序排列）
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=8")
        .then(res=>{
            setViewList(res.data)
        })
    },[])

    //获取新闻列表（按点赞量降序排列）
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=8")
        .then(res=>{
            setStarList(res.data)
        })
    },[])

    //获取所有新闻的列表
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category")
        .then(res=>{
            renderBar(_.groupBy(res.data,item => item.category.title))
        })
        return () => {
            window.onresize = null
        }
    },[])

    //柱状图
    const renderBar = (obj) => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = Echarts.init(barRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
            text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
            data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                nameRotate:"45",
                axisLabel:{
                    interval :0,
                    rotate:45
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
            {
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => {
            myChart.resize()
        }
    } 

    //饼图
    const renderPie = (obj) => {
        var myChart
        if(!pieChart){
            myChart = Echarts.init(pieRef.current);
            setPieChart(myChart)
        }else{
            myChart = pieChart
        }

        var option;
        option = {
            legend: {
                top: 'bottom'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: 'Nightingale Chart',
                    type: 'pie',
                    radius: [50, 250],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    itemStyle: {
                    borderRadius: 8
                    },
                    data: [
                    { value: 40, name: 'rose 1' },
                    { value: 38, name: 'rose 2' },
                    { value: 32, name: 'rose 3' },
                    { value: 30, name: 'rose 4' },
                    { value: 28, name: 'rose 5' },
                    { value: 26, name: 'rose 6' },
                    { value: 22, name: 'rose 7' },
                    { value: 18, name: 'rose 8' }
                    ]
                }
            ]
        };

        option && myChart.setOption(option);
    }


    const {username,region,role:{roleName}} = JSON.parse(localStorage.getItem("token"))
    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title={<div>最常浏览  <span><FundViewOutlined /></span></div>} bordered={true}>
                        <List
                            size="large"
                            bordered
                            dataSource={viewList}
                            renderItem={item => <List.Item>
                                <a href={`/news-manage/preview/${item.id}`} style={{marginRight:"20px"}}>{item.title}</a><span>{item.category.title}</span>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={<div>点赞最多  <span><LikeOutlined /></span></div>} bordered={true}>
                        <List
                            size="large"
                            bordered
                            dataSource={starList}
                            renderItem={item => <List.Item>
                                <a href={`/news-manage/preview/${item.id}`} style={{marginRight:"20px"}}>{item.title}</a><span>{item.category.title}</span>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        style={{}}
                        cover={
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                        }
                        actions={[
                        <SettingOutlined key="setting" onClick={()=>{
                            setTimeout(() => {
                                setDrawOpen(true)
                                renderPie()  
                            }, 0);
                        }}/>,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                        avatar={<Avatar src="" />}
                        title={username}
                        description={
                            <div>
                                <b>{region ? region : "全球"}</b>
                                <span style={{marginLeft:"20px",color:"#1890ff"}}>{roleName}</span>
                            </div>
                        }
                        />
                    </Card>
                </Col>
            </Row>
            
            <Drawer 
                title="Basic Drawer" 
                placement="left" 
                onClose={()=>{
                    setDrawOpen(false)
                }} 
                open={drawOpen} 
                style={{width:"500px"}}
            >
                <div ref={pieRef} style={{width: "800px",height:"400px"}}></div>
            </Drawer>
            <div ref={barRef} style={{width: "100%",height:"400px",marginTop:"40px"}}></div>
        </div>
    )
}
