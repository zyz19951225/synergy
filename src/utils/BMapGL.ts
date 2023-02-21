import Point = BMapGL.Point;
import Marker = BMapGL.Marker;
import Icon = BMapGL.Icon;
import Size = BMapGL.Size;
import Control = BMapGL.Control;

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

//地图控件
const getMapController = (data: any) => {
  let mapController = new Control();
  mapController.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
  mapController.defaultOffset = new Size(10, 10);
  mapController.initialize = (map) => {
    // 创建一个DOM元素
    let div = document.createElement("div");
    data.forEach((item: any) => {
      console.log(item);
      let button = document.createElement("button");
      button.innerHTML = item.tag;
      div.appendChild(button);

      // 设置样式
      button.onclick = function (e) {
        //todo 优化
        if (Array.isArray(item.data) && item.data.length > 0) {
          item.data[0].isVisible()
            ? item.data.forEach((marker: any) => {
                marker.hide?.();
              })
            : item.data.forEach((marker: any) => {
                marker.show?.();
              });
        } else {
          item.data.isVisible() ? item.data.hide?.() : item.data.show?.();
        }
      };
      // 添加DOM元素到地图中
      map.getContainer().appendChild(div);
    });
    // 将DOM元素返回
    return div;
  };
  return mapController;
};

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

//完善信息 增加地理坐标点
const getBMapGLPointList = (arr: Array<FactorParams>) => {
  return arr.map((value: FactorParams) => {
    return {
      ...value,
      point: new BMapGL.Point(value["Longitude"], value["Latitude"]),
    };
  }, {});
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
  /* let normalBMapGLMarkerParamsList = getBMapGLMarkerList(normalBMapGLPointParamsList)
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
         })

     }*/
  //=------------------------------

  //----------自定义控件---------------------
  map.addControl(
    getMapController([
      {
        tag: "正常轨迹",
        data: normalBMapGLPolyline,
      },
      {
        tag: "异常轨迹",
        data: abnormalBMapGLPolyline,
      },
    ])
  );
  /*
    * ,
        {
            tag: '正常坐标',
            data: normalBMapGLMarker
        }, {
            tag: '异常坐标',
            data: abnormalBMapGLMarker
        }*/
  const { center, zoom } = map.getViewport(normalBMapGLPoints);
  map.centerAndZoom(center, zoom);
  return map;
};

export default initBMapGL;
