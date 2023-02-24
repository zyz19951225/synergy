import React, { useEffect, useRef, useState } from "react";
import style from "./index.module.css";
import { Button, Form, message, Upload, UploadProps } from "antd";
import Header from "../../component/Header";
import { PictureOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {MessageItemLeft,MessageItemRight} from "../../component/Message";
import { SendValidationFactor } from "../../api";
import Papa from "papaparse";
import axios from "axios";
import { USER_NAME, VERIFICATION_INTERVAL } from "../../constant/Constant";
import initBMapGL from "../../utils/BMapGL";

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

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const SendMessage = () => {
  let factorNum = 0;
  const chatListRef = useRef(null);
  const [form] = Form.useForm();
  const [currentFactor, setCurrentFactor] = useState<FactorParams>(
    {} as FactorParams
  );
  const [previewImage, setPreviewImage] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageParams[]>([]);
  const [messageItem, setMessageItem] = useState<string>("");
  const [factorList, setFactorList] = useState<FactorParams[]>([]);
  // 监听聊天数据的变化，改变聊天容器元素的 scrollTop 值让页面滚到最底部
  useEffect(() => {
    const current = chatListRef.current!;
    //scrollHeight是页面的高度
    current["scrollTop"] = current["scrollHeight"];
  }, [messageList]);

  const onmessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageItem(e.target.value);
  };

  //解析csv文件
  // useEffect(() => {
  //   axios.get("/static/FactorList.csv").then((res) => {
  //     Papa.parse(res.data, {
  //       worker: true,
  //       header: true,
  //       dynamicTyping: true,
  //       complete(results: any, file: any) {
  //         setFactorList(results.data);
  //       },
  //     });
  //   });
  // }, []);

  useEffect(() => {
    if (factorList.length > 0) {
      sendFactorInterval(VERIFICATION_INTERVAL);
    }
  }, [factorList]);

  const sendFactorInterval = (time: number) => {
    setInterval(() => {
      sendValidationFactor(factorList[factorNum]);
      factorNum++;
      setCurrentFactor(factorList[factorNum]);
    }, time);
  };

  useEffect(() => {
    // console.log(currentFactor);
  }, [currentFactor]);

  //发送消息
  const sendValidationFactor = (factor: any) => {
    SendValidationFactor<any>(factor).then((data) => {
      // console.log('-----',data)
    });
  };

  const onChange = (info: any) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      console.log(previewImage);
      //发出新的消息
      setMessageList([
        ...messageList,
        { username: "zhangyz", head: "zhangyz", content: previewImage },
      ]);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const sendMessage = () => {
    // SendMessageApi<any>({
    //   info: form.getFieldsValue(),
    //   content: messageItem,
    // }).then((data) => {
    //   const newMessage = {
    //     head: "zhangyz",
    //     username: localStorage.getItem(USER_NAME) || "noLogin",
    //     content: messageItem || "",
    //   };
    //   setMessageList([...messageList, newMessage]);
    //   //清楚输入框数据
    //   setMessageItem("");
    // });
    const newMessage = {
      head: "zhangyz",
      username: localStorage.getItem(USER_NAME) || "noLogin",
      content: messageItem || "",
    };
    setMessageList([...messageList, newMessage]);
    //清楚输入框数据
    setMessageItem("");
  };
  const getUrl = (file: File) => {
    getBase64(file).then((res) => {
      setPreviewImage(res);
    });
  };
  useEffect(() => {
    showUserTrack("Dataset_20230115_present_User1.csv");
  }, []);
  const showUserTrack = (value: string) => {
    axios.get("/static/user/" + value).then((res) => {
      Papa.parse(res.data, {
        worker: true,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete(results: any) {
          updateMap(results.data);
        },
      });
    });
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  //地图控件
  const updateMap = (results: any) => {
    initBMapGL(results, setCurrentFactor, false);
  };

  const reply = (index:number,item={head:'root',content:'收到',username:'root'})=>{
    return (
        <MessageItemRight
            head={item.head}
            content={item.content}
            username={item.username}
        ></MessageItemRight>
    )
  }

  return (
    <div className={style["body-container"]}>
      <Header></Header>
      <div className={style.messageContainer}>
        <div className={style.message}>
          <div className={style.sendMessage}>
            <div className={style.messageContentTitle}>消息记录</div>
            <div className={style.messagePanel} ref={chatListRef}>
              {messageList.map((item: MessageParams, index) => {
                return (    <>
                  <MessageItemLeft
                      key={index}
                      head={item.head}
                      content={item.content}
                      username={item.username}
                  ></MessageItemLeft>
                  {reply(index+1)}
                </>)
              })}
            </div>
            <div>
              <Upload
                {...props}
                beforeUpload={getUrl}
                onChange={onChange}
                data={{ info: form.getFieldsValue() }}
              >
                <Button icon={<PictureOutlined />} type="primary"></Button>
              </Upload>
            </div>
            <div className={style.messageContent}>
              <TextArea
                style={{ height: "100%", resize: "none" }}
                value={messageItem}
                placeholder="请输入消息内容..."
                onChange={onmessageChange}
                onPressEnter={sendMessage}
              />
            </div>
          </div>
          <div className={style.factors}>
            <div className={style.messageContentTitle}>
              <div className={style.factorDetailTitle}>因子信息</div>
              <div className={style.factorDetailContent}>
                <div className={style.factorDetail}>
                  Service Type:{currentFactor["Service Type"] | 0}{" "}
                </div>
                <div className={style.factorDetail}>
                  Distance between BS and User:
                  {currentFactor["Distance between BS and User"] | 0}
                </div>
                <div className={style.factorDetail}>
                  Index of Satellite:{currentFactor["Index of Satellite"] | 0}
                </div>
                <div className={style.factorDetail}>
                  Service Type:{currentFactor["Service Type"] | 0}
                </div>
              </div>

              {/*<Descriptions title="因子信息" contentStyle={ { whiteSpace: 'nowrap'}} labelStyle={{whiteSpace:'nowrap'}}>*/}
              {/*    <Descriptions.Item label="Service Type">{currentFactor['Service Type']}</Descriptions.Item>*/}
              {/*    <Descriptions.Item label="Distance between BS and User" >{currentFactor['Distance between BS and User']}</Descriptions.Item>*/}
              {/*    <Descriptions.Item label="Index of Satellite">{currentFactor['Index of Satellite']}</Descriptions.Item>*/}
              {/*    <Descriptions.Item label="Remark">{currentFactor['Service Type']}</Descriptions.Item>*/}
              {/*</Descriptions>*/}
            </div>

            <div className={style.mapContainer} id="container"></div>
          </div>
        </div>
      </div>
      {/*<div className={style.sendButton}>*/}
      {/*  <Button type="primary" onClick={() => sendMessage()}>*/}
      {/*    发送消息*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  );
};
export default SendMessage;
