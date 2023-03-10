import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {  Table,Button,Tag,Modal,Popover,Switch } from 'antd';
import  { DeleteOutlined,EditOutlined,ExclamationCircleOutlined  } from '@ant-design/icons';

export default function RightList() {
    const [dataSource,setdataSource] = useState([])
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            let list = res.data
            list.forEach(item => {
                if(item.children.length === 0) item.children = ""
            });
            setdataSource(list)
        })
    },[])
    // console.log(dataSource,"@@@@");

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render:(key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title:"操作",
            render: (item) => {
                return <div>
                            <Button 
                                type="danger" 
                                icon={<DeleteOutlined />} 
                                style={{marginRight:"10px"}}
                                onClick={() => confirmMethod(item)}>
                                删除
                            </Button>
                            <Popover content={
                                <div style={{textAlign:"center"}}>
                                    <Switch checkedChildren="开启" unCheckedChildren="关闭"  checked={item.pagepermisson} onChange={() => switchMethod(item)}/>
                                </div>} 
                                title="设定是否展示配置项" 
                                trigger={item.pagepermisson === undefined ? "" : "click"}>
                                    <Button  icon={<EditOutlined />} disabled={!item.pagepermisson}>关闭/打开</Button>
                            </Popover>
                        </div>
            }
        }
    ];

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

    //删除权限
    const removeItem = (item) => {
        if(item.grade === 1){
            setdataSource(dataSource.filter(data => {
                return data.id !== item.id
            }))
            axios.delete(`/rights/${item.id}`)
        }else{
            let list = dataSource.filter(data => {
                return data.id ===  item.rightId
            })
            list[0].children =  list[0].children.filter(data => {
                return data.id !== item.id
            })
            // console.log(dataSource);
            setdataSource([...dataSource])
            axios.delete(`/children/${item.id}`)
        }
    }

    //设定配置项是否展示的开关的回调
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1 
        setdataSource([...dataSource])
        if(item.grade === 1){
            axios.patch(`/rights/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }else{
            axios.patch(`/children/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }
    }

    return (
        <Table dataSource={dataSource} columns={columns}/>
    )
}
