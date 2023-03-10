import React,{useState,useEffect,useContext,useRef} from 'react'
import axios from 'axios'
import {  Table,Button,Modal,Form,Input } from 'antd';
import  { DeleteOutlined,ExclamationCircleOutlined  } from '@ant-design/icons';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
            <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
}) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
        }, [editing]);
        const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
        };
        const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
            ...record,
            ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
        };
        let childNode = children;
        if (editable) {
        childNode = editing ? (
            <Form.Item
            style={{
                margin: 0,
            }}
            name={dataIndex}
            rules={[
                {
                required: true,
                message: `${title} is required.`,
                },
            ]}
            >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
            className="editable-cell-value-wrap"
            style={{
                paddingRight: 24,
            }}
            onClick={toggleEdit}
            >
            {children}
            </div>
        );
        }
        return <td {...restProps}>{childNode}</td>;
};

export default function NewsCateGory() {
    const [dataSource,setdataSource] = useState([])
    useEffect(() => {
        axios.get("/categories").then(res => {
            setdataSource(res.data)
        })
    },[])

    const handleSave = (record) => {
        axios.patch(`/categories/${record.id}`,{
            title:record.title,
            value:record.title
        }).then(res => {
            setdataSource(dataSource.map(data => {
                if(data.id === record.id){
                    return {
                        ...record,
                        title:record.title,
                        value:record.title
                    }
                }
                return data
            }))
        })
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave:handleSave
            }),
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
                        </div>
            }
        }
    ];

    //确认是否删除
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

    //删除
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

    return (
        <Table 
            dataSource={dataSource} 
            columns={columns} 
            rowKey={item=>item.id}
            components={
                {body: {
                    row: EditableRow,
                    cell: EditableCell,
                }}
            }
        />
    )
}

