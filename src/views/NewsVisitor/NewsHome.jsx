import React, { useEffect,useState } from 'react'
import { PageHeader,Card, Col, Row,List } from 'antd';
import axios from 'axios';
import _ from "lodash"

export default function NewsHome() {
    const [list,setList] = useState([])
    //获取新闻列表（已发布 + category）
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category")
        .then(res =>{
            let listData = Object.entries(_.groupBy(res.data,item => item.category.title))
            setList(listData)
        })
    },[])
    return (
        <div style={{
            margin:"0 auto"
        }}>
            <PageHeader
                className="site-page-header"
                // onBack={() => null}
                title="全球新闻首页"
                style={{
                    width:"100%",
                }}
                // subTitle="This is a subtitle"
            />
            {
                <div className="site-card-wrapper" style={{marginTop:"15px"}}>
                    <Row gutter={[16,16]}>
                        {
                            list.map(data => {
                                return <Col span={8} key={data[0]}>
                                        <Card title={data[0]} bordered={true} hoverable={true}>
                                            <List
                                                size="default"
                                                bordered={false}
                                                dataSource={data[1]}
                                                pagination={{
                                                    pageSize:4,
                                                    size:"small"
                                                }}
                                                renderItem={(item) => <List.Item>
                                                        <a href={`/detail/${item.id}`}>{item.title}</a>
                                                    </List.Item>}
                                            />
                                        </Card>
                                </Col>
                            })
                        }
                        
                    </Row>
                </div>
            }
        </div>
    )
}
