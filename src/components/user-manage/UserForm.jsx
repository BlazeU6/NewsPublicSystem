import React,{useState,useEffect,forwardRef} from 'react'
import { Form,Input,Select } from 'antd';
import axios from "axios"

const UserForm = forwardRef((props,ref) => {
    //获取区域列表
    const [regionsList,setregionsList]  = useState([])
    //获取角色列表
    const [roleList,setroleList]  = useState([])

    //控制地区选择框的disabled
    const [isDisabled,setisDisabled] = useState(false)

    
    //获取区域列表
    useEffect(() => {
        //判断不同角色的地区选择框的禁用情况
        const checkRegionDisable = (item) => {
            const {roleId} = JSON.parse(localStorage.getItem("token"))

            if(props.isUpdate){
                if(roleId === 1){
                    return false
                }else{
                    return true
                }
            }else{
                if(roleId === 1){
                    
                    return false
                }else{
                    
                    return true
                }
            }
        }

        axios.get("/regions").then(res => {
            let list = res.data.map(data=>{
                return {
                    ...data,
                    disabled:checkRegionDisable(data)
                }
            })
            setregionsList(list)
        })
    },[props.isUpdate])

    //获取角色列表
    useEffect(() => {
        //判断角色的角色选择框的禁用情况
        const checkRoleDisable = (item) => {
            const {roleId} = JSON.parse(localStorage.getItem("token"))
            if(props.isUpdate){
                if(roleId === 1){
                    return false
                }else{
                    return true
                }
            }else{
                if(roleId === 1){
                    return false
                }else{
                    return item.roleType < roleId
                }
            }
        }

        axios.get("/roles").then(res => {
            
            let list = res.data.map(data =>{
                return {
                    value:data.id,
                    label:data.roleName,
                    disabled:checkRoleDisable(data)
                }
            })
            setroleList(list)
        })
    },[props.isUpdate])

    //监控父组件传来的isRegionDisable
    useEffect(()=>{
        setisDisabled(props.isRegionDisable)
    },[props.isRegionDisable])

    return (
        <Form
            layout="vertical"
            ref={ref}
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                    required: true,
                    message: '请在此输入用户名!',
                    },
                ]}
                >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                    required: true,
                    message: '请在此输入密码!',
                    },
                ]}
                >
                <Input.Password placeholder="input password" />
            </Form.Item>

            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] :[
                    {
                    required: true,
                    message: '请选择区域!',
                    },
                ]}
                >
                <Select
                    // initialValues=""
                    style={{
                        width: 220,
                    }}
                    disabled={isDisabled}
                    // onChange={handleChange}
                    options={regionsList}
                />
            </Form.Item>

            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                    required: true,
                    message: '请选择角色!',
                    },
                ]}
                >
                <Select
                    // defaultValue="lucy"
                    onChange={(value) => {
                        if(value === 1) {
                            setisDisabled(true)
                            ref.current.setFieldsValue({
                                region:""
                            })
                        }else{
                            setisDisabled(false)
                        }
                    }}
                    style={{
                        width: 220,
                    }}
                    // onChange={handleChange}
                    options={
                        roleList
                    }
                />
            </Form.Item>
        </Form>
    )
})
export default UserForm
