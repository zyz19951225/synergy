import React, {useEffect, useState} from "react";
import style from './index.module.css'
import {Image} from "antd";
import {useNavigate, useSearchParams} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {GetAuthDetail} from "../../api";

interface AuthDetailType {
    total: number;
    current: number;
    data: Array<DetailType>;
}

interface DetailType {
    id: number;
    factor: string;
    certificationType: string;
    content: {
        type: string;
        message: string;
    };
    address: string;
    time: string;
    result: string

}


const AuthDetail = () => {
    const [params] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        //获取用户认证详情
        GetAuthDetail<AuthDetailType>({username: params.get('name')}).then(data => {
            setAuthInfo(data)
        })
    }, [])

    const goBack = ()=>{
        navigate(-1)
    }

    const [authInfo, setAuthInfo] = useState<AuthDetailType>({} as AuthDetailType)
    return (
        <div className={style.mainContainer}>
            <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <div className={style.authTitle}>
                    {params.get('name') ?
                        (<span style={{borderRight: '1px solid black', paddingRight: '10px'}}
                               onClick={goBack}><ArrowLeftOutlined/></span>) : ''
                    }
                    {params.get('name')}用户认证情况
                </div>
                <div className={style.authInfoContainer}>
                    {(authInfo.data || []).map((item, index) => {
                        return (
                            <div key={index}>
                                <div className={style.recordItem}>
                                    <div className={style.itemDetail1}>
                                        <span>认证因子名称：{item.factor}</span>
                                        <span style={{padding: '0 10px'}}>操作类型：{item.certificationType}</span>
                                    </div>
                                    {
                                        !item.content.type ? '' : item.content.type === 'txt' ?
                                            (<div style={{padding: '10px'}}>
                                                消息内容：{item.content.message}
                                            </div>) :
                                            (<div style={{padding: '10px'}}>
                                                消息内容：
                                                <Image
                                                    width={200}
                                                    src={item.content.message}
                                                />
                                            </div>)
                                    }
                                    <div className={style.itemDetail2}>
                                        <span>结果：{item.result}</span>
                                        <div>
                                            <span>地点：{item.address}</span>
                                            <span style={{padding: '0 10px'}}>时间：{item.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>


        </div>
    )
}

export default AuthDetail
