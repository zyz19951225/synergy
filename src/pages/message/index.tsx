import React, {useEffect, useRef, useState} from "react";
import style from "./index.module.css";
import {Button, Form, message, Modal, Switch, Upload, UploadProps} from "antd";
import Header from "../../component/Header";
import {PictureOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {MessageItemLeft, MessageItemRight} from "../../component/Message";
import {LegitimacyCheck, SendValidationFactor} from "../../api";
import Papa from "papaparse";
import axios from "axios";
import {ILLEGALITY_VERIFICATION_INTERVAL, LEGAL_VERIFICATION_INTERVAL, USER_NAME,} from "../../constant/Constant";
import {getBMapGLMarker, getBMapGLPoint, initBasicsBMapGL} from "../../utils/initBMapGL";
import Login from "../login";
import Point = BMapGL.Point;


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

const props: UploadProps = {
    action:
        "https://mock.mengxuegu.com/mock/618c70f84c5d9932f7e75d90/example/createNewJob",
    showUploadList: false,
};
let map: BMapGL.Map;
let legalFactorPointList: Array<Point> = []
let illegalFactorPointList: Array<Point> = []
let allFactorPointList: Array<Point> = []
let legalData: any;
let illegalData: any;
let currentNumForLegal = 0;
let currentNumForILLegal = 0;
let abnormalBMapGLPolyline: any;
let normalBMapGLPolyline: any;
let currentInterval: any
let legalInterval: any;
let illegalInterval: any;
const SendMessage = () => {
    // let legalInterval: any;
    // let illegalInterval: any;
    const chatListRef = useRef(null);
    const [form] = Form.useForm();
    const [currentFactor, setCurrentFactor] = useState<FactorParams>(
        {} as FactorParams
    );
    const [previewImage, setPreviewImage] = useState<string>("");
    const [messageList, setMessageList] = useState<MessageParams[]>([]);
    const [messageItem, setMessageItem] = useState<string>("");
    // const [illegalInterval, setIllegalInterval] = useState<any>();
    // const [legalInterval, setLegalInterval] = useState<any>();

    //------------------聊天框相关----------------------
    // 监听聊天数据的变化，改变聊天容器元素的 scrollTop 值让页面滚到最底部
    useEffect(() => {
        const current = chatListRef.current!;
        //scrollHeight是页面的高度
        current["scrollTop"] = current["scrollHeight"];
    }, [messageList]);
    //输入框改变收集内容
    const onmessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageItem(e.target.value);
    };
    //发送消息
    const sendValidationFactor = (factor: any) => {
        SendValidationFactor<any>(objTrans_(factor)).then((data) => {
            if (factor.Flag == 3) {
                updateBLMapGL(factor, false)
            } else {
                updateBLMapGL(factor)
            }
        }).catch((err:any)=>{
            console.error(err)
        });
    };
    //消息应答组件
    const reply = (index: number, item = {head: 'root', content: '收到', username: 'root'}) => {
        return (
            <MessageItemRight
                head={item.head}
                content={item.content}
                username={item.username}
            ></MessageItemRight>
        )
    }
    //图片上传接口
    const onChange = (info: any) => {
        console.log(info)
        if (info.file.status !== "uploading") {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
            console.log(previewImage);
            //发出新的消息
            setMessageList([
                ...messageList,
                {username: "zhangyz", head: "zhangyz", content: previewImage},
            ]);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };
    //发送消息
    const sendMessage = () => {
        const newMessage = {
            head: "zhangyz",
            username: localStorage.getItem(USER_NAME) || "noLogin",
            content: messageItem || "",
        };
        setMessageList([...messageList, newMessage]);
        //清楚输入框数据
        setMessageItem("");
    };
    //图片处理
    const getUrl = (file: File) => {
        getBase64(file).then((res) => {
            setPreviewImage(res);
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

    const initMap = async () => {
        //合法数据
        legalData = await processingCsvData('Dataset_20230222_present_User1_hefa.csv')
        //非法数据
        illegalData = await processingCsvData('Dataset_20230222_present_User1_feifa.csv')
        console.log(illegalData)
        //初始化地图
        map = initBasicsBMapGL();
        //初始化获取第一个点的信息
        LegitimacyCheck({"username": localStorage.getItem(USER_NAME)}).then((r: any) => {
            if (r) {
                sendValidationFactor(legalData[currentNumForLegal])
                currentNumForLegal++
            } else {
                //验证失败 重新登录校验
                console.log()
            }
        })
        startLegalInterval(legalData)
    }

    //更新地图节点
    const updateBLMapGL = (data: FactorParams, type = true) => {
        let curPoint = getBMapGLPoint(data)
        let curMarker = getBMapGLMarker(curPoint).marker
        curMarker.addEventListener("click", (e: any) => {
            setCurrentFactor(data)
        })
        curMarker.disableMassClear();
        if (type) {
            legalFactorPointList.push(curPoint.point)
        } else {
            illegalFactorPointList.push(curPoint.point)
        }
        allFactorPointList.push(curPoint.point)
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
        map.addOverlay(normalBMapGLPolyline)
        map.addOverlay(abnormalBMapGLPolyline)
        const {center, zoom} = map.getViewport(allFactorPointList);
        map.centerAndZoom(center, zoom)
        map.addOverlay(curMarker)
    }

    //获取文件并解析返回数据
    const processingCsvData = async (fileName: string) => {
        //文件获取
        let scvFile = await axios.get("/static/user/" + fileName)
        //文件数据处理转换
        let factors: any = await transFileData(scvFile)
        return factors.data
    }

    //封装文件解析异步函数
    const transFileData = async (scvFile: any) => {
        return await new Promise((resolve) => {
            Papa.parse(scvFile.data, {
                worker: true,
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete(results: any) {
                    return resolve(results)
                },
            });
        })
    }

    //合法数据校验
    const startLegalInterval = (data: any) => {
        legalInterval = setInterval(() => {
            console.log("合法数据校验", currentNumForLegal)
            LegitimacyCheck({"username": localStorage.getItem(USER_NAME)}).then((r: any) => {
                sendValidationFactor(data[currentNumForLegal])
                currentNumForLegal++
            }).catch((err: any) => {
                showModal(true)
            })
        }, LEGAL_VERIFICATION_INTERVAL)
    }

    //非法数据校验
    const startIllegalityInterval = (data: any) => {
        illegalInterval = setInterval(() => {
            console.log("非法数据校验", currentNumForILLegal)
            LegitimacyCheck({"username": localStorage.getItem(USER_NAME)}).then((r: any) => {
                    sendValidationFactor(data[currentNumForILLegal])
                    currentNumForILLegal++
            }).catch((err:any)=>{
                showModal(false)
            })
        }, ILLEGALITY_VERIFICATION_INTERVAL)
    }

    const changgeMode = (checked: boolean) => {
        console.log("zjlabUser1", checked)
        if (checked) {
            clearInterval(illegalInterval)
            startLegalInterval(legalData)
        } else {
            clearInterval(legalInterval)
            startIllegalityInterval(illegalData)
        }
    }

    //------------------地图相关----------------------

    //对象字段转换
    const objTrans = (obj: FactorParams) => {
        let newObj = Object.entries(obj)
        newObj.forEach(item => {
            item[0] = dataTrans(item[0])
        })
        return Object.fromEntries(newObj)
    }
    //对象字段转换
    const objTrans_ = (obj: FactorParams) => {
        let newObj = Object.entries(obj)
        newObj.forEach(item => {
            item[0] = item[0].replaceAll(" ", "_")
        })
        return Object.fromEntries(newObj)
    }
    //字段转换  转换为驼峰命名
    const dataTrans = (sentence: String) => {
        return sentence.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g,
            function (camelCaseMatch, i) {
                if (+camelCaseMatch === 0)
                    return "";
                return i === 0 ? camelCaseMatch.toLowerCase() :
                    camelCaseMatch.toUpperCase();
            });
    }


    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (intervalType: boolean) => {
        console.log("-=-=-=-=-=-=-=-=-=-=")
        console.log(intervalType)
        if (intervalType) {
            currentInterval = 'legalInterval'
            clearInterval(legalInterval)
        } else {
            currentInterval = 'illegalInterval'
            clearInterval(illegalInterval)
        }
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (isModalOpen) {

        }
    }, [isModalOpen])

    const handleOk = () => {
        console.log(currentInterval)
        if (currentInterval == 'illegalInterval') {
            startIllegalityInterval(illegalData)
        } else {
            startLegalInterval(legalData)
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={style["body-container"]}>
            <Modal title="Basic Modal"
                   width={1000}
                   open={isModalOpen}
                   footer={null}
                   closable={false}
            >
                <Login source="loginCheck" loginCheck={handleOk}></Login>
            </Modal>
            <Header></Header>
            <div className={style.messageContainer}>
                <div className={style.message}>
                    <div className={style.sendMessage}>
                        {/*<Button type="primary" onClick={showModal}>*/}
                        {/*    Open Modal*/}
                        {/*</Button>*/}
                        <div className={style.messageContentTitle}>消息记录</div>
                        <div className={style.messagePanel} ref={chatListRef}>
                            {messageList.map((item: MessageParams, index) => {
                                return (<>
                                    <MessageItemLeft
                                        key={index}
                                        head={item.head}
                                        content={item.content}
                                        username={item.username}
                                    ></MessageItemLeft>
                                    {reply(index + 1)}
                                </>)
                            })}
                        </div>
                        <div>
                            <Upload
                                {...props}
                                beforeUpload={getUrl}
                                onChange={onChange}
                                data={{info: form.getFieldsValue()}}
                            >
                                <Button icon={<PictureOutlined/>} type="primary"></Button>
                            </Upload>
                        </div>
                        <div className={style.messageContent}>
                            <TextArea
                                style={{height: "100%", resize: "none"}}
                                value={messageItem}
                                placeholder="请输入消息内容..."
                                onChange={onmessageChange}
                                onPressEnter={sendMessage}
                            />
                        </div>
                    </div>
                    <div className={style.factors}>
                        <div className={style.messageContentTitle}>
                            <div className={style.factorDetailTitle}>因子信息
                                <Switch checkedChildren="正常" unCheckedChildren="异常" defaultChecked
                                        onChange={changgeMode}/>
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
