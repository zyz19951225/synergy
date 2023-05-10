import Point = BMapGL.Point;
import Marker = BMapGL.Marker;
import Icon = BMapGL.Icon;
import Size = BMapGL.Size;


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
  Course: number;
  "Turn angle": number;
  "Overall speed": number;
  "Accelerated velocity": number;
  Sinuosity: number;
  Flag: number;
  Longitude: number;
  Latitude: number;
  point?: any;
  marker?: any;
}

//节点信息增加轨迹信息 数组
const getBMapGLMarkerList = (arr: Array<FactorParams>, tag = true) => {
  let icon = tag ? "/static/greenTarget.png" : "/static/redTarget.png";
  return arr.map((value: FactorParams) => {
    return {
      ...value,
      marker: new BMapGL.Marker(value.point, {
        icon: new Icon(icon, new Size(10, 10)),
      }),
    };
  }, {});
};

//节点信息增加轨迹信息 单点
const getBMapGLMarker = (item:FactorParams) => {
  let icon = item.Flag === 1 ? "/static/greenTarget.png" : "/static/redTarget.png";
    return {
      ...item,
      marker: new BMapGL.Marker(item.point, {
        icon: new Icon(icon, new Size(10, 10)),
      }),
    };

};

//完善信息 增加地理坐标点
const getBMapGLPointList = (arr: Array<FactorParams>) => {
  return arr.map((value: FactorParams) => {
    return {
      ...value,
      point: new BMapGL.Point(value["Longitude"], value["Latitude"]),
    };
  }, {});
};

//节点信息增加坐标点 单点
const getBMapGLPoint = (arr: FactorParams) => {
        return {
            ...arr,
            point: new BMapGL.Point(arr["Longitude"], arr["Latitude"]),
        };
};

const getInfoWindow = (
  width: number = 100,
  height: number = 100,
  title: string = "xixi",
  message: string
) => {
  return new BMapGL.InfoWindow(message, {
    width,
    height,
    title,
    message,
  });
};

const initBMapGL = (
  results: Array<FactorParams>,
  method: Function | null,
  infoWindow: boolean
) => {
  const map = new BMapGL.Map("container"); // 创建地图实例
  map.enableScrollWheelZoom(); //开启鼠标滚轮
  //根据flag拆分节点
  const normalParamsList = [] as Array<FactorParams>;
  const abnormalParamsList = [] as Array<FactorParams>;
  results.forEach((item: FactorParams) => {
    item.Flag === 1
      ? normalParamsList.push(item)
      : abnormalParamsList.push(item);
  });

  //将坐标转换为 BMapGL.Point 类型
  // //完善用户信息 增加point属性 地理坐标点
  let normalBMapGLPointParamsList = getBMapGLPointList(normalParamsList);
  let abnormalBMapGLPointParamsList = getBMapGLPointList(abnormalParamsList);
  //将point类型抽取成数组
  let normalBMapGLPoints = [] as Array<Point>;
  let abnormalBMapGLPoints = [] as Array<Point>;
  let normalBMapGLMarker = [] as Array<Marker>;
  let abnormalBMapGLMarker = [] as Array<Marker>;
  let abnormalBMapGLPolyline: any;
  let normalBMapGLPolyline: any;

  if (normalBMapGLPointParamsList.length > 0) {
    normalBMapGLPointParamsList.forEach((item: FactorParams) => {
      normalBMapGLPoints.push(item.point);
    });
    //根据节点生成正常轨迹
    normalBMapGLPolyline = new BMapGL.Polyline(normalBMapGLPoints, {
      strokeColor: "#14ff00",
      strokeWeight: 1,
      strokeOpacity: 0.5,
    });
    map.addOverlay(normalBMapGLPolyline);
  }

  if (abnormalBMapGLPointParamsList.length > 0) {
    abnormalBMapGLPointParamsList.forEach((item: FactorParams) => {
      abnormalBMapGLPoints.push(item.point);
    });
    abnormalBMapGLPolyline = new BMapGL.Polyline(abnormalBMapGLPoints, {
      strokeColor: "#ff0000",
      strokeWeight: 1,
      strokeOpacity: 0.5,
    });
    //根据节点生成异常轨迹
    map.addOverlay(abnormalBMapGLPolyline);
  }
  //完善用户信息 增加marker属性
  //=------------------------------
   let normalBMapGLMarkerParamsList = getBMapGLMarkerList(normalBMapGLPointParamsList)
     let abnormalBMapGLMarkerParamsList = getBMapGLMarkerList(abnormalBMapGLPointParamsList, false)
     if (normalBMapGLMarkerParamsList.length > 0) {
         normalBMapGLMarkerParamsList.forEach((item: FactorParams) => {
             normalBMapGLMarker.push(item.marker)
         })

         normalBMapGLMarkerParamsList.forEach((item: any) => {
             if (method) {
                 item.marker.addEventListener("click", (e: any) => {
                     method(item)
                 })
             }
             if (infoWindow) {
                 item.marker.addEventListener("click", (e: any) => {
                    map.openInfoWindow(getInfoWindow(100,100,"xx",`经度：${item.Latitude}
                   纬度：${item.Longitude}`),item.point)
                 })
             }
             map.addOverlay(item.marker)
           // item.marker.hide()
         })

     }
     if (abnormalBMapGLMarkerParamsList.length > 0) {
         abnormalBMapGLMarkerParamsList.forEach((item: FactorParams) => {
             abnormalBMapGLMarker.push(item.marker)
         })
         abnormalBMapGLMarkerParamsList.forEach((item: any) => {
             if (method) {
                 item.marker.addEventListener("click", (e: any) => {
                     method(item)
                 })
             }
             map.addOverlay(item.marker)
           // item.marker.hide()
         })

     }
  //=------------------------------

  const { center, zoom } = map.getViewport(normalBMapGLPoints);
  map.centerAndZoom(center, zoom);
  return map;
};

const initBasicsBMapGL = ()=>{
    const map = new BMapGL.Map("container"); // 创建地图实例
    map.enableScrollWheelZoom(); //开启鼠标滚轮
    let point = new BMapGL.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
    return map;
}

export {getBMapGLMarkerList,getBMapGLPointList,initBasicsBMapGL,initBMapGL,getBMapGLMarker,getBMapGLPoint}
