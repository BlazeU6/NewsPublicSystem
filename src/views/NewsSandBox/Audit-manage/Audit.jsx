import React,{useState,useEffect} from 'react'
import {  Table,Button,notification } from 'antd';
import axios from 'axios'
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';

export default function Audit() {
    const [dataSource,setdataSource] = useState([])

    //获取当前登录用户的角色Id
    const {roleId,username,region,role:{roleType}} = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get("/news?auditState=1&_expand=category").then(res => {
            setdataSource(roleId === 1 ? res.data : [
                ...res.data.filter(item => {
                    return item.author === username
                }),
                ...res.data.filter(item => {
                    return item.region === region && item.role.roleType > roleType
                })
            ])
        })
    },[roleId,username,region,roleType])

    //通过或者驳回的操作的回调
    const handleAudit = (item,auditState,publishState) => {
        axios.patch(`/news/${item.id}`,{
            "auditState": auditState,
            "publishState":publishState
        }).then(res => {
            notification.open({
                message: "通知",
                description:
                `此条新闻已经审核，请前往【审核列表】查看新闻的审核状态`,
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            setdataSource(dataSource.filter(data => {
                return data.id !== item.id
            }))
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
            title: '作者',
            dataIndex: 'author'
        },
        {
            title:"新闻分类",
            dataIndex:"category",
            render:(category) => {
                return category.title
            }
        },
        {
            title:"操作",
            render: (item) => {
                return <div>
                    <Button 
                        type="primary"
                        icon={<CheckCircleOutlined />} 
                        style={{marginRight:"10px"}}
                        onClick={() => handleAudit(item,2,1)}
                    >通过
                    </Button>
                    <Button
                        danger
                        icon={<CloseCircleOutlined />} 
                        onClick={() => handleAudit(item,3,0)}>
                        驳回
                    </Button>
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
