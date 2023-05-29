import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import { Modal, Switch } from "antd";
import Header from "../../component/Header";
import { LegitimacyCheck, SendValidationFactor } from "../../api";
import Papa from "papaparse";
import axios from "axios";
import {
  ILLEGALITY_VERIFICATION_INTERVAL,
  LEGAL_VERIFICATION_INTERVAL,
  USER_NAME,
} from "../../constant/Constant";
import {
  getBMapGLMarker,
  getBMapGLPoint,
  initBasicsBMapGL,
} from "../../utils/initBMapGL";
import Login from "../duplicationCheck";
import { UserOutlined } from "@ant-design/icons";
import Point = BMapGL.Point;
import initBMapGL, {initHistoryBMapGL} from "../../utils/BMapGL";
import {MapvglLayer, MapvglView} from "react-bmapgl/dist";

//加密
const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

//消息类型
interface MessageParams {
  head: string;
  username: string;
  content: string;
}

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

let map: BMapGL.Map;
let allPoints:Array<Point>
let legalFactorPointList: Array<Point> = [];
let illegalFactorPointList: Array<Point> = [];
let allFactorPointList: Array<Point> = [];
let legalData: any;
let illegalData: any;
let currentNumForLegal = 0;
let currentNumForILLegal = 0;
let abnormalBMapGLPolyline: any;
let normalBMapGLPolyline: any;
let currentInterval: any;
let legalInterval: any;
let illegalInterval: any;
const SendMessage = () => {
  //当前验证因子
  const [currentFactor, setCurrentFactor] = useState<FactorParams>(
    {} as FactorParams
  );
  //------------------聊天框相关----------------------
  //发送消息
  const sendValidationFactor = (factor: any) => {
    SendValidationFactor<any>(objTrans_(factor))
      .then((data) => {
        if (factor.Flag == 3) {
          updateBLMapGL(factor, false);
        } else {
          updateBLMapGL(factor);
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  };
  //------------------聊天框相关----------------------

  //------------------地图相关----------------------
  //1.获取用户合法数据及非法数据 转换成两个数组
  //2.定时发送用户校验接口，若通过则再调用发送合法数据接口 完成后向地图上添加标记点 （合法数据发送间隔30s 非法数据发送间隔5s）
  //3.用户校验失败则弹出用户验证界面 校验失败则停止发送因子接口
  //4.用户重新校验完成 则继续
  //定时发送消息接口

  //初始化选中文件并解析展示
  useEffect(() => {
    initMap();
  }, []);

  //地图初始化
  const initMap = async () => {
    let historyData = await processingCsvData(
        "history.csv"
    );
    ({map, allPoints} = initHistoryBMapGL(historyData.filter((item:FactorParams,index:number)=>{
      return index % 10 == 0
    }), null, true));

    //合法数据
    legalData = await processingCsvData(
      "Dataset_20230222_present_User1_hefa.csv"
    );
    //非法数据
    illegalData = await processingCsvData(
      "Dataset_20230222_present_User1_feifa.csv"
    );
    // //初始化地图
    // map = initBasicsBMapGL();
    //初始化获取第一个点的信息
    LegitimacyCheck({ username: sessionStorage.getItem(USER_NAME) })
      .then((r: any) => {
        sendValidationFactor(legalData[currentNumForLegal]);
        currentNumForLegal++;
        startLegalInterval(legalData);
      })
      .catch((e) => {
        startLegalInterval(legalData);
      });
  };

  //更新地图节点
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
    allPoints.push(curPoint.point)
    let { center, zoom } = map.getViewport(allPoints);
    map.centerAndZoom(center, zoom);
    map.addOverlay(curMarker);
  };

  //获取文件并使用固定步长取数返回数据
  // const processingCsvData5 = async (fileName: string) => {
  //   //文件获取
  //   let scvFile = await axios.get("/static/user/" + fileName);
  //   //文件数据处理转换
  //   let factors: any = await transFileData(scvFile);
  //   return factors.data.filter((item,index)=>{
  //     return index%5 === 0
  //   });
  // };


  //获取文件并解析返回数据
  const processingCsvData = async (fileName: string) => {
    //文件获取
    let scvFile = await axios.get("/static/user/" + fileName);
    //文件数据处理转换
    let factors: any = await transFileData(scvFile);
    return factors.data;
  };

  //封装文件解析异步函数
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

  //合法数据校验
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
          showModal(true);
        });
    }, LEGAL_VERIFICATION_INTERVAL);
  };

  //非法数据校验
  const startIllegalityInterval = (data: any) => {
    illegalInterval = setInterval(() => {
      console.log("非法数据校验", currentNumForILLegal);
      LegitimacyCheck({ username: sessionStorage.getItem(USER_NAME) })
        .then((r: any) => {
          sendValidationFactor(data[currentNumForILLegal]);
          currentNumForILLegal++;
        })
        .catch((err: any) => {
          showModal(false);
        });
    }, ILLEGALITY_VERIFICATION_INTERVAL);
  };

  //切换数据（异常与正常数据）
  const changeMode = (checked: boolean) => {
    console.log(checked);
    if (checked) {
      clearInterval(illegalInterval);
      startLegalInterval(legalData);
    } else {
      clearInterval(legalInterval);
      startIllegalityInterval(illegalData);
    }
  };

  //------------------地图相关----------------------

  //对象字段转换
  const objTrans_ = (obj: FactorParams) => {
    let newObj = Object.entries(obj);
    newObj.forEach((item) => {
      item[0] = item[0].replaceAll(" ", "_");
    });
    return Object.fromEntries(newObj);
  };
  //字段转换  转换为驼峰命名

  const [isModalOpen, setIsModalOpen] = useState(false);

  //用户异常校验确认
  const handleOk = () => {
    if (currentInterval == "illegalInterval") {
      startIllegalityInterval(illegalData);
    } else {
      startLegalInterval(legalData);
    }
    setIsModalOpen(false);
    playPause(true);
  };

  //展示用户异常校验框
  const showModal = (intervalType: boolean) => {
    //暂停视频播放
    playPause(false);
    if (intervalType) {
      currentInterval = "legalInterval";
      clearInterval(legalInterval);
    } else {
      currentInterval = "illegalInterval";
      clearInterval(illegalInterval);
    }
    setIsModalOpen(true);
  };

  //视频播放控制
  const playPause = (isPlay: boolean) => {
    const myVideo = document.getElementsByTagName("video")[0];
    if (isPlay) {
      myVideo.play();
    } else {
      myVideo.pause();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
    }
  }, [isModalOpen]);

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
              <div className={style.factorDetailContent}>
                <div className={style.factorDetail}>
                  Service Type:{currentFactor["Service Type"] || 0}
                </div>
                <div className={style.factorDetail}>
                  Distance between BS and User:
                  {currentFactor["Distance between BS and User"] || 0}
                </div>
                <div className={style.factorDetail}>
                  Index of Satellite:{currentFactor["Index of Satellite"] || 0}
                </div>
                <div className={style.factorDetail}>
                  Velocity of User(m/s):
                  {(currentFactor["Velocity of User"] * 1000).toFixed(2) || 0}
                </div>
              </div>
            </div>
            <div className={style.mapContainer} id="container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SendMessage;
