import {useState,useEffect} from 'react'
import axios from 'axios'
import {notification} from 'antd'


function usePublish(type){
    const [dataSource,setDataSource] = useState([])
    const {username} = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?publishState=${type}&author=${username}&_expand=category`).then(res => {
            setDataSource(res.data)
        })
    },[username,type])

    //点击发布后的回调
    const handlePublish = (id)=>{
        axios.patch(`/news/${id}`,{
            "publishState": 2,
            "publishTime":Date.now()
        }).then(res => {
            notification.open({
                message: "通知",
                description:
                "你的新闻已经发布，请在【发布管理/已发布】中查看新闻",
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            setDataSource(dataSource.filter(data => {
                return data.id !== id
            }))
        })
    }
    //点击下线后的回调
    const handleOffline = (id)=>{
        axios.patch(`/news/${id}`,{
            "publishState": 3
        }).then(res => {
            notification.open({
                message: "通知",
                description:
                "你的新闻已经下线，请在【发布管理/已下线】中查看新闻",
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            setDataSource(dataSource.filter(data => {
                return data.id !== id
            }))
        })
    }

    //点击删除后的回调
    const handleDelete = (id) => {
        axios.delete(`/news/${id}`)
        .then(res => {
            notification.open({
                message: "通知",
                description:
                "你已删除已下线的新闻！",
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            setDataSource(dataSource.filter(data => {
                return data.id !== id
            }))
        })
    }
    return {
        dataSource,
        handlePublish,
        handleOffline,
        handleDelete
    }
}
export default usePublish