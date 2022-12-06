// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, {useEffect} from "react";
import style from './index.module.css'
import {Map, InfoWindow, Marker, NavigationControl, ZoomControl, Polyline} from "react-bmapgl/dist";




const HistoricalRoute = () => {


    useEffect(()=> {
        const map = new BMapGL.Map("container");          // 创建地图实例
        map.centerAndZoom(new BMapGL.Point(116.404, 39.928), 8);
        map.enableScrollWheelZoom();
        map.addEventListener('click', function (e) {
            alert('点击位置经纬度：' + e.latlng.lng + ',' + e.latlng.lat);
        })
        const polyline = new BMapGL.Polyline([
            new BMapGL.Point(16.399, 39.910),
            new BMapGL.Point(116.405, 39.920),
            new BMapGL.Point(116.425, 39.900)
        ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
        map.addOverlay(polyline);
    })
    return (
        <div className={style.mainContainer} id='container' >
        </div>
    )
}

export default HistoricalRoute
