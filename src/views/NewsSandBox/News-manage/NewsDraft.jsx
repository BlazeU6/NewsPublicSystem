import React, { useEffect,useState } from 'react'
import { Table,Button,Modal,notification } from 'antd';
import axios from 'axios';
import {
    DeleteOutlined,
    EditOutlined,
    CloudUploadOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';



export default function NewsDraft(props) {
    //存放草稿箱中的新闻
    const [data,setData] = useState([])
    // //模态框
    // const [isModalOpen, setIsModalOpen] = useState(false);

    const {username} = JSON.parse(localStorage.getItem("token"))

    useEffect(()=>{
        axios.get(`/news?author=${username}&auditState=0&_expand=category`)
        .then(res=>{
            setData(res.data)
        })
    },[username])

    //删除某一项新闻
    const removeItem = (item) => {
        setData([
            ...data.filter(dataItem => {
                return dataItem.id !== item.id
            })
        ])
        axios.delete(`/news/${item.id}`)
    }

    //确认是否删除权限
    const { confirm } = Modal;
    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除此项吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                //前端修改数据更新页面 + 后端发请求改数据
                removeItem(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render:(id) => {
                return <b>{id}</b>
            }
        },
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
            render:(item => {
                return <div>
                    <Button 
                        type="danger" 
                        shape="circle" 
                        icon={<DeleteOutlined />} 
                        size="large"
                        onClick={()=>{
                            confirmMethod(item)
                            // setIsModalOpen(true)
                        }}/>
                    <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<EditOutlined />} 
                        size="large" 
                        style={{margin:"0 20px"}}
                        onClick={()=>{props.history.push(`/news-manage/update/${item.id}`)}}
                    />
                    <Button 
                        shape="circle" 
                        icon={<CloudUploadOutlined />} 
                        size="large"
                        onClick={() => {
                            axios.patch(`/news/${item.id}`,{
                                "auditState": 1,
                            }).then(res => {
                                notification.open({
                                    message: "通知",
                                    description:
                                    "你的新闻已经保存，请在审核列表查看新闻",
                                    onClick: () => {
                                        console.log('Notification Clicked!');
                                    },
                                });
                                props.history.push("/audit-manage/list")
                            })
                        }}
                    />
                </div>
            })
        }
    ]
    return (
        <div>
            <Table columns={columns} dataSource={data} rowKey={(item)=>item.id} pagination={{pageSize:8}}/>
        </div>
    )
}
