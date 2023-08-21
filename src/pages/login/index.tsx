import React, {useEffect, useState} from "react";
import md5 from "js-md5";
import style from "./index.module.css";
import Title from "../../component/Title";
import {
    Alert,
    Button,
    Checkbox,
    Descriptions,
    Form,
    Input,
    message,
} from "antd";
import {useNavigate} from "react-router-dom";
import {UserLogin} from "../../api";
import {USER_NAME} from "../../constant/Constant";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {dateFmt} from "../../utils/Tools";

//用户验证体
interface userInfo {
    userName: string;
    password: string;
    type: number;
    ip: string;
    certificate: string;
    area: string;
}

interface propsType {
    source: string | undefined;
    loginCheck: Function | undefined;
}

type validateStatusType =
    | ""
    | "error"
    | "success"
    | "warning"
    | "validating"
    | undefined;
type verificationType = "error" | "success" | "warning" | "info" | undefined;

const Login = (props: propsType) => {
    const naviGate = useNavigate();
    const [validateStatus, setValidateStatus] =
        useState<validateStatusType>(undefined);
    const [verification, setVerification] = useState<verificationType>("success");
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    //用户登陆位置
    const [usingSite, setUsingSite] = useState("Hangzhou, Zhejiang");
    //登陆表单是否可用
    const [remainingTime, setRemainingTime] = useState(0);
    const delayDuration = 1 * 10 * 1000; // 延时时间，单位为毫秒
    const loginDuration = 1 * 60 * 1000; // 延时时间，单位为毫秒
    const storageKey = 'loginState'; // 用于存储登录状态的键名
    const maxAttempts = 3;           // 最大尝试次数

    const [remainingAttempts, setRemainingAttempts]
        = useState(maxAttempts); // 剩余尝试次数
    const [isLoginEnabled, setIsLoginEnabled] = useState(false); // 登陆是否可用


    //记录用户登陆状态（每次登陆都记录状态 连续登陆时间为5分钟）
    const checkUserLoginState = () => {
        // @ts-ignore
        const loginState = JSON.parse(localStorage.getItem(storageKey))
        if (loginState) {
            const {remainingAttempts, unlockTime} = loginState;
            //判断用户上次错误登陆时间是否在5分钟内
            if (Date.now() - unlockTime > loginDuration) {
                localStorage.removeItem(storageKey)
                setIsLoginEnabled(true)
            } else {
                setIsLoginEnabled(false)
                setRemainingAttempts(remainingAttempts)
                //定时器
                const remainingTime = unlockTime - Date.now();
                setRemainingTime(remainingTime)
            }
        }else {
            setIsLoginEnabled(true)
        }
    }

    useEffect(() => {
        let timeId = 0
        if (remainingTime < 0) {
            setIsLoginEnabled(true)
            localStorage.removeItem(storageKey)
        } else {
            // @ts-ignore
            timeId = setInterval(() => {
                setRemainingTime(pre => pre - 1000)
            }, 1000)
        }
        return () => {
            console.log("timeId,")
            clearInterval(timeId)
        }
    }, [remainingTime])


    useEffect(() => {
        checkUserLoginState()
    }, [])


    const recordErrorUserLogin = () => {
        setRemainingAttempts(prevState => prevState - 1)
        let loginState
        let unlockTime = Date.now() + delayDuration
        if (remainingAttempts === 0) {
            loginState = {
                remainingAttempts: remainingAttempts,
                unlockTime: unlockTime,
            };
            setIsLoginEnabled(false)
            setRemainingTime(unlockTime - Date.now())
        } else {
            loginState = {
                remainingAttempts: remainingAttempts,
                unlockTime: null,
            }
        }
        localStorage.setItem(storageKey, JSON.stringify(loginState));
    }


    //页面异常提示
    const error = () => {
        messageApi.open({
            type: "error",
            content: "请检查用户验证信息",
        });
    };

    //登录验证接口（登录按钮）
    const onFinish = (values: userInfo) => {
        values = {...values, password: md5(values.password).toUpperCase()};
        //携带验证字符串及ip
        if (values.type == 0) {
            values.ip = "1.1.1.1";
            values.certificate = "zjlab1-certificate";
            values.area = "Zhejiang,Hangzhou";
        } else {
            values.ip = "xx";
            values.certificate = "xx";
            values.area = "Hangzhou,Huzhou";
        }
        UserLogin<any>(values)
            .then((data) => {
                if (props.source === "loginCheck") {
                } else {
                    window.sessionStorage.setItem(USER_NAME, values.userName);
                    naviGate("/sendMessage");
                }
            })
            .catch((e) => {
                //减少登陆次数
                recordErrorUserLogin()
                // //用户登陆失败处理
                // setLoginAttempts(loginAttempts + 1);
                // if (loginAttempts < 2) {
                //   // message.error('用户名或密码错误，请重试');
                // } else {
                //   message.error('登录尝试次数过多，请稍后再试');
                //   disableLoginForm();
                //   scheduleUnlock(Date.now() + delayDuration);
                // }
                error();
            });
    };

    //用户名输入框事件 显示当前用户是否存在验证证书
    const onPressEnter = (e: any) => {
        e.preventDefault();
        //前端用户名校验
        if (
            e.target.value === "zjlabUser1" ||
            e.target.value === "zjlabUser2" ||
            e.target.value === "zjlabUser3"
        ) {
            setValidateStatus("success");
        } else {
            setValidateStatus("error");
        }
    };

    //异常证书测试选项 用户验证证书
    const onChange = (e: CheckboxChangeEvent) => {
        if (e.target.checked) {
            form.setFieldsValue({
                type: 1,
                ip: "0.0.0.0",
            });
            setUsingSite("Huzhou,Zhejiang");
            setVerification("error");
        } else {
            form.setFieldsValue({
                type: 1,
                ip: "0.0.0.0",
            });
            setUsingSite("Hangzhou,Zhejiang");
            setVerification("success");
        }
    };

    return (
        <div className={style.bodyContainer}>
            {contextHolder}
            {/*天地协同标题*/}
            <div className={style.loginTitle}>
                <Title></Title>
            </div>
            {/*登录Form表单*/}
            <div className={style.loginContainer}>
                <div className={style.loginItem}>
                    <div className={style.loginForm}>
                        <Form
                            form={form}
                            initialValues={{
                                type: 0,
                            }}
                            disabled={!isLoginEnabled}
                            labelCol={{span: 6}}
                            wrapperCol={{span: 16}}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="userName"
                                label="用户名"
                                rules={[{required: true}]}
                                hasFeedback
                                validateStatus={validateStatus}
                            >
                                <Input onPressEnter={onPressEnter} onBlur={onPressEnter}/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="密码"
                                rules={[{required: true}]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            {validateStatus === "success" ? (
                                <Form.Item name="type" label="证书信息">
                                    <Alert
                                        message="当前用户存在可用证书"
                                        action={
                                            <Checkbox onChange={onChange}>异常证书测试</Checkbox>
                                        }
                                        description={
                                            <Descriptions column={1}>
                                                <Descriptions.Item label="证书有限期">
                                                    2023/12/31
                                                </Descriptions.Item>
                                                <Descriptions.Item label="使用地">
                          <span
                              style={{
                                  color:
                                      verification != "success" ? "red" : "black",
                              }}
                          >
                            {usingSite}
                          </span>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        }
                                        type={verification}
                                        showIcon
                                    />
                                </Form.Item>
                            ) : validateStatus === "error" ? (
                                <Form.Item name="type" label="证书信息">
                                    <Alert message="当前用户无可用证书" type="error" showIcon/>
                                </Form.Item>
                            ) : (
                                ""
                            )}
                            <Form.Item wrapperCol={{offset: 6, span: 16}}>

                                {
                                    remainingTime <= 0 ?
                                        (<Button type="primary" htmlType="submit">
                                            登录
                                        </Button>) :
                                        (<Button type="primary" danger>
                                            {dateFmt(remainingTime, 'mm:ss')} 秒后可登陆
                                        </Button>)
                                }
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
