import React,{useEffect, useState,useRef} from 'react'
import { PageHeader,Steps,Button,Form,Input,Select,message,notification } from 'antd';
import "./News.css"
import axios from 'axios';
import NewsEdit from "../../../components/News-manage/NewsEdit"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsAdd(props) {
    const [current,setcurrent] = useState(0)
    const [categoryList,setCategoryList] = useState([])
    //存放表单信息（新闻标题和主题）
    const [formInfo,setFormInfo] = useState({})
    //存放新闻的内容
    const [content,setContent] = useState("")

    const onFinish = (values) => {
        console.log('Success:', values);
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }
    const handleChange = (value) => {
        //console.log(`selected ${value}`);
    };

    //为表单创建ref
    const formRef = useRef(null)

    //获取新闻主题列表
    useEffect(()=>{
        axios.get("/categories").then(res => {
            const list = res.data.map(item => {
                return {
                    value:item.id,
                    label:item.title
                }
            })
            setCategoryList(list)
        })
    },[])

    //收集子组件中富文本编辑器里的内容  子传父
    const getContent = (content) => {
        setContent(content)
    }

    const {region,roleId,username} = JSON.parse(localStorage.getItem("token"))
    //提交审核和保存至草稿箱的回调
    const handleSave = (auditState) => {
        axios.post("/news",{
            ...formInfo,
            content,
            "region": region === "" ? "全球" : region,
            "author": username,
            "roleId": roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            "publishTime": 0
        }).then(res => {
            notification.open({
                message: "通知",
                description:
                `你的新闻已经保存，请前往${auditState === 0 ? "草稿箱" : "审核列表"}查看新闻`,
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            props.history.push(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
        })
    }

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="撰写新闻"
                // subTitle="This is a subtitle"
            />
            <Steps
                style={{margin:"40px",width:"90%"}}
                current={current}
                items={[
                {
                    title: '基本信息',
                    description:"新闻标题、分类"
                },
                {
                    title: '新闻内容',
                    description:"主体内容",
                },
                {
                    title: '提交新闻',
                    description:"保存草稿或提交审核"
                },
                ]}
            />
            {/* form表单 */}
            {
                <div className={current === 0 ? "" : "hidden"}>
                    <Form
                        ref={formRef}
                        style={{
                            width:"80%",
                            marginTop:"60px"
                        }}
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                            {
                                required: true,
                                message: '请在此输入新闻标题!',
                            },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻主题"
                            name="categoryId"
                            rules={[
                            {
                                required: true,
                                message: '请在此输入新闻主题!',
                            },
                            ]}
                        >
                            <Select
                                // initialValues="lucy"
                                style={{
                                    width: 835,
                                }}
                                onChange={handleChange}
                                options={categoryList}
                            />
                        </Form.Item>

                    </Form>
                </div>
            }
            {/* 富文本编辑器 */}
            {
                <div className={current === 1 ? "" : "hidden"}>
                    <NewsEdit getContent={getContent}/>
                </div>
            }
            
            {/* 下一页 */}
            {
                current < 2 && 
                <Button 
                    type="primary" 
                    onClick={()=>{
                        //验证是否处于第一步
                        if(current === 0){
                            //表单验证
                            formRef.current.validateFields()
                            .then(res => {
                                //验证成功
                                setFormInfo(res)
                                setcurrent(current + 1)
                            }).catch(err => {
                                console.log(err);
                            })
                        }else{
                            if(content === "" || content.trim() === "<p></p>"){
                                message.error("新闻内容不能为空")
                            }else{
                                setcurrent(current + 1) 
                            }   
                            
                        }
                    }}
                    style={{marginRight:"30px"}}
                    >下一页
                </Button>
            }
            {/* 提交 */}
            {
                current === 2 && 
                <Button type="danger" style={{marginRight:"30px"}} onClick={()=>handleSave(1)}>
                    提交新闻
                </Button>
            }
            {/* 保存至草稿箱 */}
            {
                current === 2 && 
                <Button type="primary"
                    onClick={()=>handleSave(0)}
                >
                    保存至草稿箱
                </Button>
            }
            {/* 上一页 */}
            {
                current > 0 && 
                <Button type="primary" onClick={()=>{setcurrent(current - 1)}}
                style={{marginLeft:"30px"}}
                >
                    上一页
                </Button>
            }
        </div>
    )
}
