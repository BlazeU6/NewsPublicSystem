import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {  Table,Button,Modal,Tree  } from 'antd';
import  { DeleteOutlined,EditOutlined,ExclamationCircleOutlined  } from '@ant-design/icons';


export default function RoleList() {
    
    const [dataSource,setdataSource] = useState([])
    const [isModalOpen,setisModalOpen] = useState(false)
    const [rightData ,setrightData ] = useState([])
    const [currentRight,setcurrentRight] = useState([])
    const [currentId,setcurrentId] = useState("")

    useEffect(() => {
        axios.get("/roles").then(res => {
            setdataSource(res.data)
        })
    },[])

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setrightData(res.data)
        })
    },[])

    //配置表格的列
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render:(id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
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
                    <Button  icon={<EditOutlined />} onClick={() => {
                        //console.log(item);
                        setisModalOpen(true)
                        setcurrentRight(item.rights)
                        setcurrentId(item.id)
                    }}>
                        编辑
                    </Button>

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
        setdataSource(dataSource.filter(data => {
            return data.id !== item.id
        }))
        axios.delete(`/roles/${item.id}`)
    }

    const handleCancel = () => {
        setisModalOpen(false)
    }
    const handleOk = () => {
        setisModalOpen(false)
        //同步至dataSource
        setdataSource(dataSource.map(data => {
            if(data.id === currentId){
                return { 
                    ...data,
                    right:currentRight
                }
            }
            return data
        }))
        //同步至后端--patch
        axios.patch(`/roles/${currentId}`,{
            rights:currentRight
        })
    }

    const onCheck = (checkKeys) => {
        setcurrentRight(checkKeys.checked)
    }

    return (
        <div>
            <Table 
                dataSource={dataSource} 
                columns={columns} 
                rowKey={(item)=>item.id} 
                pagination={{pageSize:8}}
            />
            
            <Modal title="Basic Modal" 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRight}
                    onCheck={onCheck}
                    treeData={rightData}
                    checkStrictly={true}
                    />
            </Modal>
        </div>
    )
}
