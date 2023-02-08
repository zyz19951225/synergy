import React, {useEffect, useState} from "react";
import style from "./index.module.css";
import {Button, Select} from "antd";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";

//用户属性类型
interface FactorParams {
  "Accelerated velocity": number;
  Course: number;
  "Distance between BS and User": number;
  "Elevation between BS and Satellite": number;
  Flag: number;
  "Index of Satellite": number;
  "Latitude": number;
  "Longitude": number;
  "Longitudinal Index of BS": number;
  "Overall speed": number;
  "Service Type": number;
  Sinuosity: number;
  "Traffic Volume": number;
  "Transverse Index of BS": number;
  "Turn angle": number;
  "Velocity of User": number;
}

const HistoricalRoute = () => {

  const [options, setOptions] = useState([{
    value: '',
    label: ''
  }])

  const navigate = useNavigate();

  //获取所有的用户轨迹文件名称 循环生成用户选择列表
  useEffect(() => {
    axios.get("/static/user/").then((res) => {
      const userList = res.data.map((cur: string) => {
        return {
          value: cur,
          label: cur,
        }
      })
      setOptions(userList)
      showUserTrack(userList[0].value)
    });
  }, []);


  //展示对应用户轨迹
  const showUserTrack = (value: String) => {
    axios.get("/static/user/" + value).then((res) => {
      Papa.parse(res.data, {
        worker: true,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete(results: any, file: any) {
            updateMap(results)
        },
      });
    });
  }

  const updateMap = (results:any) => {
    const map = new BMapGL.Map("container"); // 创建地图实例
    map.enableScrollWheelZoom();//开启鼠标滚轮
    map.addEventListener("click", function (e) {
      alert("当前位置：" + e.point.lng + ", " + e.point.lat);
    })
    let pointList = results.data.map((value: FactorParams) => {
      let la = value['Latitude']
      let lo = value['Longitude']
      return {la, lo}
    }, {})
    let points = pointList.map((value: any) => {
      return new BMapGL.Point(value.lo, value.la)
    })
    const polyline = new BMapGL.Polyline(points,
        {strokeColor: "green", strokeWeight: 1, strokeOpacity: 0.3}
    );
    map.addOverlay(polyline);
    const {center, zoom} = map.getViewport(points)
    map.centerAndZoom(center, zoom)
  }


  const backToAuthHistory = () => {
    navigate('/authRecord')
  }

  const onSearch = (value: string) => {
    console.log('search:', value);
  };
  return (
      <>
        <div className={style.header}>
          <Button type="text" className={style.backbtn} onClick={backToAuthHistory}>返回</Button>
          aaa的历史轨迹
        </div>
        <div className={style.mainContainer}>
          <div className={style.chooseContainer}>
            <div>
            <Select
                showSearch
                placeholder="select user code"
                optionFilterProp="children"
                onChange={showUserTrack}
                onSearch={onSearch}
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                value={options[0].value}
                options={
                  options
                }
            />
            </div>
          </div>
          <div className={style.mapContainer} id="container"></div>
        </div>
      </>
  )
}

export default HistoricalRoute;
