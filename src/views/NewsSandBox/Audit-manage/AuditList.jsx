import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { Table,Button,Tag,notification } from 'antd';

export default function AuditList(props) {
    //当前登录用户的用户名
    const {username} = JSON.parse(localStorage.getItem("token"))

    //保存符合要求的新闻列表
    const [dataSource,setDataSource] = useState([])
    //获取符合要求的新闻列表
    useEffect(()=>{
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
        .then(res => {
            setDataSource(res.data)
        })
    },[username])

    //新闻的操作回调
    //撤销
    const handleRevocation = (item) => {
        axios.patch(`/news/${item.id}`,{
            "auditState": 0,
        }).then(res => {
            notification.open({
                message: "通知",
                description:
                "你的新闻已经撤销，请在草稿箱中查看新闻",
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            setDataSource(dataSource.filter(data => {
                return data.id !== item.id
            }))
        })
    }
    //修改
    const handleUpdate = (item) => {
        props.history.push(`/news-manage/update/${item.id}`)
    }
    //发布
    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`,{
            "publishState": 2,
            "publishTime":Date.now()
        }).then(res => {
            notification.open({
                message: "通知",
                description:
                "你的新闻已经发布，请在发布管理中查看新闻",
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            setDataSource(dataSource.filter(data => {
                return data.id !== item.id
            }))
            props.history.push("/publish-manage/published")
        })
    }
    //配置表格的列
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render:(title,item) => {
                return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
            }   
        },
        {
            title:"作者",
            dataIndex:"author"
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render:(category)=>{
                return <div>{category.title}</div>
            }
        },
        {
            title:"审核状态",
            dataIndex:"auditState",
            render:(auditState)=>{
                const auditStateList = ["未审核","审核中","已通过","未通过"]
                const colorList = ["","orange","green","red"]
                return <Tag color={colorList[auditState]}>{auditStateList[auditState]}</Tag>
            }
        },
        {
            title:"操作",
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 && <Button danger onClick={()=> handleRevocation(item)}>撤销</Button>
                    }
                    {
                        item.auditState === 2 && <Button type="primary" onClick={()=>handlePublish(item)}>发布</Button>
                    }
                    {
                        item.auditState === 3 && <Button onClick={()=>handleUpdate(item)}>修改</Button>
                    }
                </div>
            }
        }
    ];

    return (
        <div>
            <Table 
                dataSource={dataSource} 
                columns={columns} 
                rowKey={(item)=>item.id} 
                pagination={{pageSize:8}}
            />
        </div>
    )
}
