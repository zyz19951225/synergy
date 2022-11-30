import React, {useEffect, useRef, useState} from 'react'
import style from './index.module.css'
import {Button, Form, Input, message, Upload, UploadProps} from "antd";
import Header from "../../component/Header";
import {PictureOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import MessageItem from "../../component/Message";



const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


interface MessageParams {
    head: string;
    username: string;
    content: string
}

const props: UploadProps = {
    action: 'https://mock.mengxuegu.com/mock/618c70f84c5d9932f7e75d90/example/createNewJob',
    showUploadList: false,
};

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
};


const SendMessage = () => {
    const chatListRef = useRef(null)
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState("");
    const [messageList, setMessageList] = useState<MessageParams[]>([])
    const [messageItem, setMessageItem] = useState<MessageParams>({
        content: "", head: "", username: ""
    })
    // 监听聊天数据的变化，改变聊天容器元素的 scrollTop 值让页面滚到最底部
    useEffect(() => {
        const current = chatListRef.current!
        //scrollHeight是页面的高度
         current['scrollTop'] = current['scrollHeight']
    }, [messageList])

    const onmessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageItem({
            content: e.target.value,
            head: "zhangzy",
            username: "zhangzy"
        })
    }
    const [factors] = useState(
        {
            "Traffic Volume": 347.414525393146,
            "Service Type": 3.0,
            "Transverse Index of BS": 6.0,
            "Longitudinal Index of BS": 36.0,
            "Distance between BS and User": 735.543015347981,
            "Elevation between BS and Satellite": 2.13735084766429,
            "Index of Satellite": 6.0,
            "Velocity of User": 0.0169380413049092,
            "Latitude of User": 760.716023215943,
            "Longitude of User": 508.675233236697,
            "Course": 0.0,
            "Turn angle": 0.458683066843297,
            "Overall speed": 0.0,
            "Accelerated velocity": 0.552166518295338,
            "Sinuosity": 1.0
        })


    const onChange = (info:any)=>{
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                console.log(previewImage)
                //发出新的消息
                setMessageList([...messageList,{username: "zhangyz", head: "zhangyz", content: previewImage}])
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
    }

    const sendMessage = () => {
        console.log(form.getFieldsValue())
        setMessageList([...messageList, messageItem])
        setMessageItem({content: "", head: "", username: ""})
    }

    const getUrl = (file:File)=>{
        getBase64(file).then(
           res=>{
               setPreviewImage(res)
           }
       )
    }

    const onFinish = (values: any) => {
        console.log(values);
    };

    return (
        <div className={style['body-container']}>
            <Header></Header>
            <div className={style.messageContainer}>
                <div className={style.message}>
                    <div className={style.sendMessage}>
                        <div className={style.messageContentTitle}>消息记录</div>
                        <div className={style.messagePanel} ref={chatListRef}>
                            {messageList.map((item: MessageParams, index) => {
                                return <MessageItem key={index}
                                                head={item.head}
                                                content={item.content}
                                                username={item.username}
                                ></MessageItem>
                            })}
                        </div>
                        <div>
                            <Upload {...props} beforeUpload={getUrl} onChange={onChange}>
                                <Button icon={<PictureOutlined/>} type='primary'></Button>
                            </Upload>
                        </div>
                        <div className={style.messageContent}>
                            <TextArea style={{height: '100%', resize: 'none'}} value={messageItem.content}
                                      placeholder="请输入消息内容..."
                                      onChange={onmessageChange}/>
                        </div>
                    </div>
                    <div className={style.factors}>
                        <div className={style.messageContentTitle}>
                            因子信息
                        </div>
                        <div className={style.factorsItems}>
                            <Form  {...layout}
                                   labelWrap
                                   form={form}
                                   labelAlign='left'
                                   name="control-hooks"
                                   onFinish={onFinish}>
                            {Object.entries(factors).map((key) => {
                                return (
                                    <Form.Item
                                        style={{marginBottom:'10px'}}
                                        name={key[0]}
                                        label={key[0]}
                                        rules={[{ required: true }]}
                                        key={key[0]}
                                        initialValue={key[1]}
                                    >
                                        <Input />
                                    </Form.Item>
                                )
                            })}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.sendButton}>
                <Button type='primary' onClick={() => sendMessage()}>发送消息</Button>
            </div>
        </div>
    )
}
export default SendMessage
