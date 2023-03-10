import { Button  } from 'antd';
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish"

export default function Sunset() {
    const {dataSource,handleDelete} = usePublish(3)//publishState === 3表示已下线 

    return (
        <NewsPublish 
            dataSource={dataSource}
            button={(id)=>
                <Button 
                    danger
                    onClick={()=>handleDelete(id)}
                >
                    删除
                </Button>
            }
        />
    )
}