import React, {useEffect, useState} from "react";
import md5 from 'js-md5';
import style from "./index.module.css";
import Title from "../../component/Title";
import {Alert, Button, Checkbox, Descriptions, Form, Input, message} from "antd";
import {useNavigate} from "react-router-dom";
import {UserLogin} from "../../api";
import {USER_NAME} from "../../constant/Constant";
import {CheckboxChangeEvent} from "antd/es/checkbox";

interface userInfo {
  userName: string;
  password: string;
  type: number;
}

interface CredentialType {
  label: string;
  value: number;
}

interface CredentialDetail {
  info: string;
}

interface propsType {
  source: string | undefined;
  loginCheck: Function | undefined
}


type validateStatusType = "" | "error" | "success" | "warning" | "validating" | undefined

type  verificationType = "error" | "success" | "warning" | "info" | undefined

const Login = (props: propsType) => {
  const naviGate = useNavigate();
  const [validateStatus, setValidateStatus] = useState<validateStatusType>(undefined)
  const [verification, setVerification] = useState<verificationType>('success')
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const clickHandle = () => {
    if (props.loginCheck)
      props.loginCheck()
  }

  const error = () => {
    messageApi.open({
      type: 'error',
      content: '请检查用户验证信息',
    });
  };

  const onFinish = (values: userInfo) => {
    console.log(values)
    values = {...values, password: md5(values.password).toUpperCase()}
    UserLogin<any>(values).then((data) => {
      if (props.source === 'loginCheck') {
        clickHandle()
      } else {
        window.localStorage.setItem(USER_NAME, values.userName);
        naviGate("/sendMessage");
      }
    }).catch((e)=>{
      error()
    });
  };

  const onPressEnter = (e: any) => {
    e.preventDefault();
    if (e.target.value === 'zjlabUser1' || e.target.value === 'zjlabUser2' || e.target.value === 'zjlabUser3') {
      setValidateStatus("success")
    } else {
      setValidateStatus("error")
    }
  }
  const onChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      form.setFieldsValue({"type":1})
      setVerification("error")
    } else {
      form.setFieldsValue({"type":0})
      setVerification("success")
    }

  };
  return (
      <div className={style.bodyContainer}>
        {contextHolder}
        <Title></Title>
        <div className={style.loginContainer}>
          {/*<span className={style.loginTitle}>登录</span>*/}
          <div className={style.loginForm}>
            <div className={style.loginLeft}>
              <div className={style.loginItem}>
                <Form
                    form={form}
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
                  {validateStatus === 'success' ?
                      <Form.Item
                          name="type"
                          label="证书信息"
                      >
                        <Alert
                            message="当前用户存在可用证书"
                            action={
                              <Checkbox onChange={onChange}>异常证书测试</Checkbox>
                            }
                            description={
                              <Descriptions column={1}>
                                <Descriptions.Item label="证书有限期">2023/12/31</Descriptions.Item>
                                <Descriptions.Item label="允许使用地">Hangzhou, Zhejiang</Descriptions.Item>
                              </Descriptions>
                            }
                            type={verification}
                            showIcon
                        />
                      </Form.Item> :
                      (validateStatus === 'error'?
                          <Form.Item
                              name="type"
                              label="证书信息"
                          >
                            <Alert
                                message="当前用户无可用证书"
                                type="error"
                                showIcon
                            />
                          </Form.Item> :''
                      )
                    }
                  <Form.Item wrapperCol={{offset: 6, span: 16}}>
                    <Button type="primary" htmlType="submit">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
export default Login;
