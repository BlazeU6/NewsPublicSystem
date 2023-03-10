import React, { useEffect,useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import moment from "moment"
import DOMPurify from 'dompurify'

export default function NewPreview(props) {
    //保存当前预览的新闻相关的信息
    const [newInfo,setNewInfo] = useState(null)
    useEffect(()=>{
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
        .then(res => {
            setNewInfo(res.data)
        })
    },[props.match.params.id])

    const auditStateList = ["未审核","审核中","已通过","未通过"]
    const publishStateList = ["未发布","待发布","已上线","已下线"]
    const colorList = ["","orange","green","red"]
    return (
        <div>
            { newInfo && <div>
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={newInfo.title}
                    subTitle={newInfo.category.title}
                    style={{
                        border:"1px solid #f0f2f5",
                        margin:"10px",
                        padding:"15px"
                    }}
                    >
                    <Descriptions size="small" column={3} >
                        <Descriptions.Item label="创建者">{newInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(newInfo.createTime).format("YYYY-MM-DD  HH:mm:ss")}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{newInfo.publishTime ? moment(newInfo.publishTime).format("YYYY-MM-DD  HH:mm:ss") : "---"}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态"><span style={{color:colorList[newInfo.auditState]}}>{auditStateList[newInfo.auditState]}</span></Descriptions.Item>
                        <Descriptions.Item label="发布状态"><span style={{color:colorList[newInfo.auditState]}}>{publishStateList[newInfo.publishState]}</span></Descriptions.Item>
                        <Descriptions.Item label="访问数量">{newInfo.view}</Descriptions.Item>
                        <Descriptions.Item label="点赞数量">{newInfo.star}</Descriptions.Item>
                        <Descriptions.Item label="评论数量">{newInfo.star}</Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <div
                    dangerouslySetInnerHTML={{
                        __html:DOMPurify.sanitize(newInfo.content)
                    }}
                    style={{
                        border:"1px solid #f0f2f5",
                        margin:"30px 10px",
                        padding:"15px",
                        color:"#000"
                    }}
                >
                </div>
            </div>}
        </div>
    )
}
