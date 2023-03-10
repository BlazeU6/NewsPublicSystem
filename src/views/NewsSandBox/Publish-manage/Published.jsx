import { Button  } from 'antd';
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish"

export default function Published() {
    const {dataSource,handleOffline} = usePublish(2)//publishState === 2表示已发布 

    return (
        <NewsPublish 
            dataSource={dataSource}
            button={(id)=>
                <Button 
                    onClick={()=>handleOffline(id)}
                >
                    下线
                </Button>
            }
        />
    )
}
