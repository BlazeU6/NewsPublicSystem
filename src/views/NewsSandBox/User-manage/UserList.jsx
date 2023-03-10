import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {  Table,Button,Modal,Switch } from 'antd';
import  { DeleteOutlined,EditOutlined,ExclamationCircleOutlined  } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';


export default function UserList() {
    //users + role列表
    const [dataSource,setdataSource] = useState([])
    //更新按钮模态框是否打开的状态
    const [isUpdateOpen,setisUpdateOpen] = useState(false)
    //添加用户的模态框是否打开的状态
    const [isOpen,setisOpen] = useState(false)

    //获取角色列表
    const [roleList,setroleList]  = useState([])
    
    //获取区域列表
    const [regionsList,setregionsList]  = useState([])

    //添加用户表单的ref
    const addFormRef = useRef(null)

    //更新用户的表单的ref
    const updateFormRef = useRef(null)

    //传给子组件中用来控制表单中地区的是否显示
    const [isRegionDisable,setisRegionDisable] = useState(false)

    //保存当前要更新的所在项的id
    const [currentId,setcurrentId] = useState(null)
    //获取当前登录用户的角色Id
    const {roleId,username,region,role:{roleType}} = JSON.parse(localStorage.getItem("token"))
    //获取users + role列表
    useEffect(() => {
        axios.get("/users?_expand=role").then(res => {
            setdataSource(roleId === 1 ? res.data : [
                ...res.data.filter(item => {
                    return item.username === username
                }),
                ...res.data.filter(item => {
                    return item.region === region && item.role.roleType > roleType
                })
            ])
        })
    },[roleId,username,region,roleType])

    //获取角色列表
    useEffect(() => {
        axios.get("/roles").then(res => {
            setroleList(res.data)
        })
    },[])

    //获取区域列表
    useEffect(() => {
        axios.get("/regions").then(res => {
            setregionsList(res.data)
        })
    },[])

    //配置表格的列
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionsList.map(item => {
                    return {
                        text:item.title,
                        value:item.value
                    }
                }),
                {
                    text:"全球",
                    value:""
                }
            ],
            onFilter:(value,item) => {
                //这里的形参item是指Table中每一行的数据
                return value === item.region
            },
            render:(region) => {
                return <b>{region === "" ? "全球" : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render:(role) => {
                return <b>{role?.roleName}</b>
            }
        },
        {
            title:"用户名",
            dataIndex:"username"
        },
        {
            title:"用户状态",
            dataIndex:"roleState",
            render:(roleState,item) =>{
                return <Switch 
                            checkedChildren="开启" 
                            unCheckedChildren="关闭" 
                            checked={roleState} 
                            disabled={item.default}
                            onChange={()=>{
                                item.roleState = !item.roleState
                                setdataSource([...dataSource])
                                axios.patch(`/users/${item.id}`,{
                                    roleState:item.roleState
                                })
                            }}
                            // onChange={}
                        />
            }
        },
        {
            title:"用户名",
            render: (item) => {
                return <div>
                    <Button 
                        type="danger" 
                        icon={<DeleteOutlined />} 
                        style={{marginRight:"10px"}}
                        onClick={() => confirmMethod(item)}
                        disabled={item.default}>
                            删除
                    </Button>
                    <Button
                        icon={<EditOutlined />} 
                        onClick={async() => {
                            await setisUpdateOpen(true)
                            if(item.roleId === 1){
                                //region禁用
                                setisRegionDisable(true)
                            }else{
                                //不禁用
                                setisRegionDisable(false)
                            }
                            //保存所在项的id
                            setcurrentId(item.id)
                            //此处要注意，react中状态更新不是同步的，这个时候表单组件还没挂载，所以要让这两个部分的代码变成同步的
                            updateFormRef.current.setFieldsValue(item)
                        }}
                        disabled={item.default}>
                        更新
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
                //console.log('Cancel');
            },
        });
    }

    //删除用户
    const removeItem = (item) => {
        setdataSource(dataSource.filter(data => {
            return data.id !== item.id
        }))
        axios.delete(`/users/${item.id}`)
    }

    //更新用户信息的模态框的取消的回调
    const handleCancel = () => {
        setisRegionDisable(!isRegionDisable)
        setisUpdateOpen(false)
    }
     //更新用户信息的模态框的确认的回调
    const handleOk = () => {
        // setisUpdateOpen(false)
        // //同步至dataSource
        // setdataSource(dataSource.map(data => {
        //     if(data.id === currentId){
        //         return {
        //             ...data,
        //             right:currentRight
        //         }
        //     }
        //     return data
        // }))
        // //同步至后端--patch
        // axios.patch(`/roles/${currentId}`,{
        //     rights:currentRight
        // })
        setisUpdateOpen(false)
        updateFormRef.current.validateFields().then(value=>{
            //console.log(value);
            setdataSource(dataSource.map(item =>{
                if(item.id === currentId){
                    return {
                        ...item,
                        ...value,
                        role:roleList.filter(data => {
                            return data.id === value.roleId
                        })[0]
                    }
                }
                return item
            }))
            setisRegionDisable(!isRegionDisable)
            axios.patch(`/users/${currentId}`,value)
        })
    }

    //提交表单
    const submitForm = () => {
        setisOpen(false)
        addFormRef.current.validateFields().then(value => {
            //先发送给后端，让后端返回一个对象，里面有这个新添加的user的id，方便后面的删除和更新操作
            axios.post(`/users`,{
                ...value,
                "roleState": true,
                "default": false,
            }).then(res =>{
                //更新状态数据
                setdataSource([...dataSource,{
                    ...res.data,
                    role:roleList.filter(item => {
                        return item.id === res.data.roleId
                    })[0]
                }])
            })
        }).catch(err => {
            console.log(err);
        })  
    }

    return (
        <div>
            <Button type="primary" onClick={() => {setisOpen(true)}}>添加用户</Button>

            <Table 
                dataSource={dataSource} 
                columns={columns} 
                rowKey={(item)=>item.id} 
                pagination={{pageSize:8}}
            />

            <Modal title="更新用户信息" 
                open={isUpdateOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}>
                <UserForm ref={updateFormRef} isRegionDisable={isRegionDisable} isUpdate={true}/>
            </Modal>

            <Modal
                open={isOpen}
                title="添加用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => {
                    setisOpen(false)
                }}
                onOk={() => submitForm()}
                >
                <UserForm ref={addFormRef} />
            </Modal>
        </div>
    )
}
