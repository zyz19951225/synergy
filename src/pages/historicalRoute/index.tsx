import React from "react";
import style from './index.module.css'
import {useSearchParams} from "react-router-dom";


const HistoricalRoute = () => {

    const [params] = useSearchParams()

    return (
        <div className={style.mainContainer}>
            {params.get('name')}
        </div>
    )
}

export default HistoricalRoute
