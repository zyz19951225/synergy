import React, {useEffect, useState} from "react";
import style from "./index.module.css";
import {Button, Select} from "antd";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";

//用户属性类型
interface FactorParams {
  "Traffic Volume": number;
  "Service Type": number;
  "Transverse Index of BS": number;
  "Longitudinal Index of BS": number;
  "Distance between BS and User": number;
  "Elevation between BS and Satellite": number;
  "Index of Satellite": number;
  "Velocity of User": number;
  "Latitude of User": number;
  "Longitude of User": number;
  "Course": number;
  "Turn angle": number;
  "Overall speed": number;
  "Accelerated velocity": number;
  "Sinuosity": number;
  "Flag": number;
  "Longitude":number;
  "Latitude":number;
}

const HistoricalRoute = () => {
  let userFileList = ["Dataset_20230115_present_User1.csv","Dataset_20230115_present_User10.csv","Dataset_20230115_present_User100.csv","Dataset_20230115_present_User11.csv","Dataset_20230115_present_User12.csv","Dataset_20230115_present_User13.csv","Dataset_20230115_present_User14.csv","Dataset_20230115_present_User15.csv","Dataset_20230115_present_User16.csv","Dataset_20230115_present_User17.csv","Dataset_20230115_present_User18.csv","Dataset_20230115_present_User19.csv","Dataset_20230115_present_User2.csv","Dataset_20230115_present_User20.csv","Dataset_20230115_present_User21.csv","Dataset_20230115_present_User22.csv","Dataset_20230115_present_User23.csv","Dataset_20230115_present_User24.csv","Dataset_20230115_present_User25.csv","Dataset_20230115_present_User26.csv","Dataset_20230115_present_User27.csv","Dataset_20230115_present_User28.csv","Dataset_20230115_present_User29.csv","Dataset_20230115_present_User3.csv","Dataset_20230115_present_User30.csv","Dataset_20230115_present_User31.csv","Dataset_20230115_present_User32.csv","Dataset_20230115_present_User33.csv","Dataset_20230115_present_User34.csv","Dataset_20230115_present_User35.csv","Dataset_20230115_present_User36.csv","Dataset_20230115_present_User37.csv","Dataset_20230115_present_User38.csv","Dataset_20230115_present_User39.csv","Dataset_20230115_present_User4.csv","Dataset_20230115_present_User40.csv","Dataset_20230115_present_User41.csv","Dataset_20230115_present_User42.csv","Dataset_20230115_present_User43.csv","Dataset_20230115_present_User44.csv","Dataset_20230115_present_User45.csv","Dataset_20230115_present_User46.csv","Dataset_20230115_present_User47.csv","Dataset_20230115_present_User48.csv","Dataset_20230115_present_User49.csv","Dataset_20230115_present_User5.csv","Dataset_20230115_present_User50.csv","Dataset_20230115_present_User51.csv","Dataset_20230115_present_User52.csv","Dataset_20230115_present_User53.csv","Dataset_20230115_present_User54.csv","Dataset_20230115_present_User55.csv","Dataset_20230115_present_User56.csv","Dataset_20230115_present_User57.csv","Dataset_20230115_present_User58.csv","Dataset_20230115_present_User59.csv","Dataset_20230115_present_User6.csv","Dataset_20230115_present_User60.csv","Dataset_20230115_present_User61.csv","Dataset_20230115_present_User62.csv","Dataset_20230115_present_User63.csv","Dataset_20230115_present_User64.csv","Dataset_20230115_present_User65.csv","Dataset_20230115_present_User66.csv","Dataset_20230115_present_User67.csv","Dataset_20230115_present_User68.csv","Dataset_20230115_present_User69.csv","Dataset_20230115_present_User7.csv","Dataset_20230115_present_User70.csv","Dataset_20230115_present_User71.csv","Dataset_20230115_present_User72.csv","Dataset_20230115_present_User73.csv","Dataset_20230115_present_User74.csv","Dataset_20230115_present_User75.csv","Dataset_20230115_present_User76.csv","Dataset_20230115_present_User77.csv","Dataset_20230115_present_User78.csv","Dataset_20230115_present_User79.csv","Dataset_20230115_present_User8.csv","Dataset_20230115_present_User80.csv","Dataset_20230115_present_User81.csv","Dataset_20230115_present_User82.csv","Dataset_20230115_present_User83.csv","Dataset_20230115_present_User84.csv","Dataset_20230115_present_User85.csv","Dataset_20230115_present_User86.csv","Dataset_20230115_present_User87.csv","Dataset_20230115_present_User88.csv","Dataset_20230115_present_User89.csv","Dataset_20230115_present_User9.csv","Dataset_20230115_present_User90.csv","Dataset_20230115_present_User91.csv","Dataset_20230115_present_User92.csv","Dataset_20230115_present_User93.csv","Dataset_20230115_present_User94.csv","Dataset_20230115_present_User95.csv","Dataset_20230115_present_User96.csv","Dataset_20230115_present_User97.csv","Dataset_20230115_present_User98.csv","Dataset_20230115_present_User99.csv"]

  const [options, setOptions] = useState([{
    value: '',
    label: ''
  }])

  const [currentUser,setCurrentUser] = useState("Dataset_20230115_present_User1.csv")

  const navigate = useNavigate();

  //获取所有的用户轨迹文件名称 循环生成用户选择列表
  useEffect(() => {
    let userList = userFileList.map((cur: string) => {
          return {
            value: cur,
            label: cur,
          }
        })
        setOptions(userList)
        showUserTrack(userList[0].value)
  }, []);


  //展示对应用户轨迹
  const showUserTrack = (value: string) => {
    setCurrentUser(value)
    axios.get("/static/user/" + value).then((res) => {
      Papa.parse(res.data, {
        worker: true,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete(results: any, file: any) {
            updateMap(results.data)
        },
      });
    });
  }
  const getPointList = (arr:Array<FactorParams> )=>{
    return arr.map((value: FactorParams) => {
      return new BMapGL.Point(value['Longitude'], value['Latitude'])
    }, {})
  }

  const updateMap = (results:any) => {
    const map = new BMapGL.Map("container"); // 创建地图实例
    map.enableScrollWheelZoom();//开启鼠标滚轮
    //根据flag拆分节点
    const flagOnePoints = [] as Array<FactorParams>
    const flagThreePoints = [] as Array<FactorParams>
    results.forEach((item:FactorParams)=>{
      item.Flag === 1? flagOnePoints.push(item):flagThreePoints.push(item)
    })
    let pointListForOne = getPointList(flagOnePoints)
    let pointListForThree = getPointList(flagThreePoints)

    if (pointListForOne.length>0){
      const polylineOne = new BMapGL.Polyline(pointListForOne,
          {strokeColor: "green", strokeWeight: 1, strokeOpacity: 0.5}
      );
      map.addOverlay(polylineOne);
    }

    if (pointListForThree.length > 0){
      const polylineThree = new BMapGL.Polyline(pointListForThree,
          {strokeColor: "#ee0e0e", strokeWeight: 1, strokeOpacity: 0.5}
      );
      map.addOverlay(polylineThree);
    }
    const {center, zoom} = map.getViewport(pointListForOne)
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
                style={{width:300}}
                showSearch
                placeholder="select user code"
                optionFilterProp="children"
                onChange={showUserTrack}
                onSearch={onSearch}
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                defaultValue={currentUser}
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
