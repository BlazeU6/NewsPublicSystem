import React, { useEffect,useState } from 'react'
import {useParams} from "react-router-dom"
import { Descriptions, PageHeader,Button, message } from 'antd';
import axios from 'axios';
import moment from "moment"
import DOMPurify from 'dompurify'
import {LikeOutlined} from '@ant-design/icons';
import localStorage from 'redux-persist/es/storage';

export default function Detail(props) {
    //保存当前预览的新闻相关的信息
    const [newInfo,setNewInfo] = useState(null)

    const params = useParams()
    useEffect(()=>{
        axios.get(`/news/${params.id}?_expand=category&_expand=role`)
        .then(res => {
            setNewInfo({
                ...res.data,
                view:res.data.view + 1
            })
            return res.data
        })
        .then(res => {
            axios.patch(`/news/${params.id}`,{
                view:res.view + 1
            })
        })
    },[params.id])

    //点赞的回调
    const handleLike = (id) => {
        // const starList = JSON.parse(localStorage.getItem("starList"))
        let star = localStorage.getItem("star") || [];
        console.log(star);
        if(star.includes(id.toString())){
            message.info('您已经点过赞了喔');
        }else{
            axios.patch(`/news/${id}`,{
                star:newInfo.star + 1
            }).then(res => {
                setNewInfo({
                    ...newInfo,
                    star:res.data.star
                })
                const arr = [...star]
                localStorage.setItem("star",arr.concat(id))
            }).catch((e) => console.log(e));
        }
    }
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
                    extra={[
                        <Button key="3" type="primary" onClick={()=>handleLike(params.id)}>赞一下<LikeOutlined /></Button>,
                    ]}
                    >
                    <Descriptions size="small" column={3} >
                        <Descriptions.Item label="作者">{newInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{newInfo.publishTime ? moment(newInfo.publishTime).format("YYYY-MM-DD  HH:mm:ss") : "---"}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newInfo.region}</Descriptions.Item>
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
