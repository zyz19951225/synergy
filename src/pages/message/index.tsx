import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import { Descriptions, Modal, Switch } from "antd";
import Header from "../../component/Header";
import { LegitimacyCheck, SendValidationFactor } from "../../api";
import Papa from "papaparse";
import axios from "axios";
import {
  ALL_DATA,
  ILLEGAL_DATA,
  ILLEGALITY_VERIFICATION_INTERVAL,
  LEGAL_DATA,
  LEGAL_VERIFICATION_INTERVAL,
  USER_NAME,
} from "../../constant/Constant";
import { getBMapGLMarker, getBMapGLPoint } from "../../utils/initBMapGL";
import Login from "../duplicationCheck";
import { UserOutlined } from "@ant-design/icons";
import { initHistoryBMapGL } from "../../utils/BMapGL";
import Point = BMapGL.Point;

//校验参数
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

//地图实例
let map: BMapGL.Map;
//初始化为地图历史轨迹点
let allPoints: Array<Point>;
//合法轨迹点Point数组
let legalFactorPointList: Array<Point> = [];
//合法轨迹点Point数组
let illegalFactorPointList: Array<Point> = [];
//轨迹点Point数组
let allFactorPointList: Array<Point> = [];
//csv文件数据
let allData: any;
//csv非法数据
let illegalData: any;
//合法数据当前索引
let currentNumForLegal = 0;
//非法数据当前索引
let currentNumForILLegal = 0;
//非法数据轨迹
let abnormalBMapGLPolyline: any;
//合法数据轨迹
let normalBMapGLPolyline: any;
//当前定时器标识
let currentInterval: any;
//合法数据定时器
let legalInterval: any;
//非法定时器
let illegalInterval: any;

const SendMessage = () => {
  //当前验证因子
  const [currentFactor, setCurrentFactor] = useState<FactorParams>(
    {} as FactorParams
  );
  //用户校验弹框
  const [isModalOpen, setIsModalOpen] = useState(false);
  //初始化选中文件并解析展示
  useEffect(() => {
    initMap();
    return function clear() {
      console.log("----------------------");
      //保证定时器停止成功
      clearInterval(currentInterval);
      clearInterval(legalInterval);
      clearInterval(illegalInterval);
    };
  }, []);

  //发送验证因子
  //type 标识定时器类型
  const sendValidationFactor = (factor: any, type = true) => {
    SendValidationFactor<any>(objTrans_(factor))
      .then((data) => {
        updateBLMapGL(factor);
        if (factor.Flag === ILLEGAL_DATA) {
          if (type) {
            showModalAndClearInterval(true);
          } else {
            showModalAndClearInterval(false);
          }
        }
      })
      .catch((e) => {
        throw e;
      });
  };

  /**
   * @Description: 地图初始化
   * @param
   * @return
   */
  const initMap = async () => {
    await initMapAndCreateHistory();

    //获取当前文件所有的数据
    allData = await processingCsvData("allInfo.csv");
    //非法数据
    illegalData = allData.filter(
      (item: FactorParams) => item.Flag === ILLEGAL_DATA
    );
    //初始化获取第一个点的信息
    LegitimacyCheck({ username: sessionStorage.getItem(USER_NAME) })
      .then((r: any) => {
        sendValidationFactor(allData[currentNumForLegal]);
        currentNumForLegal++;
        startLegalInterval(allData);
      })
      .catch((e) => {
        //初始化用户验证失败 开启定时器 认证及打点
        startLegalInterval(allData);
      });
  };

  /**
   * @Description: 历史轨迹处理
   * @param
   * @return
   */
  const initMapAndCreateHistory = async () => {
    //获取历史数据 地图上灰色轨迹
    let historyData = await processingCsvData("history.csv");
    // 初始化地图,渲染历史数据点 返回地图实例 及 所有数据点（用于计算当前地图的缩放比例）
    ({ map, allPoints } = initHistoryBMapGL(
      historyData.filter((item: FactorParams, index: number) => {
        return index % 10 === 0;
      }),
      null,
      true
    ));
  };

  /**
   * @Description: 更新地图 增加点（根据Type删除不同的轨迹点）
   * @param     FactorParams
   * @return
   */
  const updateBLMapGL = (data: FactorParams, type = true) => {
    let curPoint = getBMapGLPoint(data);
    let curMarker = getBMapGLMarker(curPoint).marker;
    setCurrentFactor(data);
    curMarker.addEventListener("click", (e: any) => {
      setCurrentFactor(data);
    });
    //curMarker.disableMassClear();
    if (type) {
      legalFactorPointList.push(curPoint.point);
    } else {
      illegalFactorPointList.push(curPoint.point);
    }
    allFactorPointList.push(curPoint.point);
    //根据节点生成正常轨迹
    normalBMapGLPolyline = new BMapGL.Polyline(legalFactorPointList, {
      strokeColor: "#14ff00",
      strokeWeight: 1,
      strokeOpacity: 0.5,
    });
    if (illegalFactorPointList.length > 0)
      abnormalBMapGLPolyline = new BMapGL.Polyline(illegalFactorPointList, {
        strokeColor: "#ff0000",
        strokeWeight: 1,
        strokeOpacity: 0.5,
      });
    map.clearOverlays();
    // map.addOverlay(normalBMapGLPolyline);
    // map.addOverlay(abnormalBMapGLPolyline);
    const { center, zoom } = map.getViewport(allFactorPointList);
    allPoints.push(curPoint.point);
    map.centerAndZoom(center, zoom);
    map.addOverlay(curMarker);
  };

  /**
   * @Description: 解析csv文件 返回指定数据（0：所有数据 1：合法数据 3：异常数据）
   * @param   文件名 标识
   * @return     数组
   */
  const processingCsvData = async (fileName: string, flag = 0) => {
    if (flag === ALL_DATA) {
      //文件获取
      let scvFile = await axios.get("/static/user/" + fileName);
      //文件数据处理转换
      let factors: any = await transFileData(scvFile);
      return factors.data;
    } else if (flag === LEGAL_DATA) {
      //文件获取
      let scvFile = await axios.get("/static/user/" + fileName);
      //文件数据处理转换
      let factors: any = await transFileData(scvFile);
      return factors.data.filter((item: FactorParams) => {
        return item.Flag === flag;
      });
    } else if (flag === ILLEGAL_DATA) {
      //文件获取
      let scvFile = await axios.get("/static/user/" + fileName);
      //文件数据处理转换
      let factors: any = await transFileData(scvFile);
      return factors.data.filter((item: FactorParams) => {
        return item.Flag === flag;
      });
    }
  };

  /**
   * @Description: 封装文件解析异步函数
   * @param     文件
   * @return
   */
  const transFileData = async (scvFile: any) => {
    return await new Promise((resolve) => {
      Papa.parse(scvFile.data, {
        worker: true,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete(results: any) {
          return resolve(results);
        },
      });
    });
  };

  /**
   * @Description:  合法数据发送流程
   * @param        文件数组
   * @return
   */
  const startLegalInterval = (data: any) => {
    legalInterval = setInterval(() => {
      console.log("合法数据校验", currentNumForLegal);
      LegitimacyCheck({ username: sessionStorage.getItem(USER_NAME) })
        .then((r: any) => {
          console.log("用户校验成功！！！");
          sendValidationFactor(data[currentNumForLegal]);
          currentNumForLegal++;
        })
        .catch((err: any) => {
          console.log("用户校验失败！！！");
          showModalAndClearInterval(true);
        });
    }, LEGAL_VERIFICATION_INTERVAL);
  };

  /**
   * @Description:  非法数据发送流程
   * @param        文件数组
   * @return
   */
  const startIllegalityInterval = (data: any) => {
    illegalInterval = setInterval(() => {
      console.log("非法数据校验", currentNumForILLegal);
      LegitimacyCheck({ username: sessionStorage.getItem(USER_NAME) })
        .then((r: any) => {
          sendValidationFactor(data[currentNumForILLegal], false);
          currentNumForILLegal++;
        })
        .catch((err: any) => {
          console.log("用户校验失败！！！");
          showModalAndClearInterval(false);
        });
    }, ILLEGALITY_VERIFICATION_INTERVAL);
  };

  /**
   * @Description: 切换数据按钮（异常与正常数据）
   * @param
   * @return
   */
  const changeMode = (checked: boolean) => {
    console.log(checked);
    if (checked) {
      clearInterval(illegalInterval);
      startLegalInterval(allData);
    } else {
      clearInterval(legalInterval);
      startIllegalityInterval(illegalData);
    }
  };

  //------------------地图相关----------------------

  /**
   * @Description:  对象字段格式转换
   * @param       对象
   * @return      'a b'  =>  a_b
   */
  const objTrans_ = (obj: FactorParams) => {
    let newObj = Object.entries(obj);
    // newObj.forEach((item) => {
    //   item[0] = item[0].replaceAll(" ", "_");
    // });
    return Object.fromEntries(newObj);
  };

  /**
   * @Description:   关闭认证弹框 开启定时器 继续播放视频
   * @param
   * @return
   */
  const handleOk = () => {
    if (currentInterval == "illegalInterval") {
      startIllegalityInterval(illegalData);
    } else {
      startLegalInterval(allData);
    }
    setIsModalOpen(false);
    playPause(true);
  };

  /**
   * @Description:   用户认证异常 暂停视频播放 停止定时器 打开认证弹框
   * @param   定时器标识
   * @return
   */
  const showModalAndClearInterval = (intervalType: boolean) => {
    //暂停视频播放
    playPause(false);
    //根据类型 停止当前定时器
    console.log(intervalType ? "停止正常" : "停止异常");
    if (intervalType) {
      currentInterval = "legalInterval";
      clearInterval(legalInterval);
    } else {
      currentInterval = "illegalInterval";
      clearInterval(illegalInterval);
    }
    //打开认证弹框
    setIsModalOpen(true);
  };

  /**
   * @Description: 视频播放控制
   * @param   控制标识
   * @return
   */
  const playPause = (isPlay: boolean) => {
    const myVideo = document.getElementsByTagName("video")[0];
    isPlay ? myVideo.play() : myVideo.pause();
  };

  return (
    <div className={style["body-container"]}>
      <Header></Header>
      <div className={style.messageContainer}>
        <Modal
          transitionName=""
          className={style.authModel}
          title={
            <span className={style["model-title"]}>
              <UserOutlined /> 用户异常校验
            </span>
          }
          open={isModalOpen}
          footer={null}
          closable={false}
        >
          <Login loginCheck={handleOk}></Login>
        </Modal>

        <div className={style.message}>
          <div className={style.leftVideo}>
            <video controls loop autoPlay muted>
              <source
                src={require("../../asserts/big_buck_bunny.mp4")}
                type="video/mp4"
              ></source>
            </video>
          </div>
          <div className={style.factors}>
            <div className={style.messageContentTitle}>
              <div className={style.factorDetailTitle}>
                因子信息
                <Switch
                  checkedChildren="正常"
                  unCheckedChildren="异常"
                  defaultChecked
                  onChange={changeMode}
                />
              </div>
              <Descriptions
                size="small"
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
              >
                {Object.entries(currentFactor).map((item, index) => {
                  if (
                    item[0] === "Flag" ||
                    item[0] === "Latitude of User" ||
                    item[0] === "Longitude of User"
                  ) {
                    return;
                  }
                  return (
                    <Descriptions.Item key={index} label={item[0]}>
                      {item[1].toFixed(2) || 0}
                    </Descriptions.Item>
                  );
                })}
              </Descriptions>
            </div>
            <div className={style.mapContainer} id="container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SendMessage;
