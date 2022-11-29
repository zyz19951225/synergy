import React, {useState} from "react";
import style from './index.module.css'


const Authentication = () => {
    const [authInfo] = useState([{
        name:'aaa',
        type:'login',
        content:'this is content',
        result:'认证成功'
    },
        {
            name:'bbb',
            type:'send',
            content:'this is content',
            result:'认证成功'
        }])
    return (
        <div className={style.mainContainer}>
            <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
                <div className={style.authTitle}>当前用户认证情况</div>
                <div className={style.authInfoContainer}>
                    {authInfo.map(item=>{
                       return (
                           <>
                               <div className={style.recordItem}>
                                   <div className={style.itemDetail1}>
                                       <span>认证因子名称：{item.name}</span>
                                       <span style={{padding:'0 10px'}}>认证内容：{item.content}</span>
                                   </div>
                                   <div className={style.itemDetail2}>
                                       <span>结果：xxxx</span>
                                       <div>
                                           <span>地点：浙江kk</span>
                                           <span style={{padding:'0 10px'}}>时间：asd</span>
                                       </div>
                                   </div>
                               </div>
                           </>
                       )
                    })}

                </div>
            </div>


        </div>
    )
}

export default Authentication
