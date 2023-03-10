import React from 'react'
import { Button, Form, Input, message } from 'antd';
import "./index.css"
import axios from 'axios';

export default function Login(props) {
    const onFinish = (values) => {
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
        .then(res =>{
            if(res.data.length !== 0){
                localStorage.setItem("token",JSON.stringify(res.data[0]))
                props.history.push("/")
            }else{
                message.error("用户名与密码不匹配！")
            }
        })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div 
            style={{
                    background:"rgba(255, 255, 255, 0.3)",
                    height:"100%",
                }}>
            <div className="formContainer">
                <div className='formTitle'>全球新闻发布系统</div>
                <Form
                    className='formContent'
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                        offset: 8,
                        span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                        登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
        
    )
}
