import React, {useEffect, useState} from "react";
import md5 from 'js-md5';
import style from "./index.module.css";
import Title from "../../component/Title";
import {Button, Form, Input, message, Select} from "antd";
import {useNavigate} from "react-router-dom";
import {UserLogin} from "../../api";
import {USER_NAME} from "../../constant/Constant";

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

const Login = (props: propsType) => {
  const naviGate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectOptions, setSelectOptions] = useState([
    {
      label: "正常证书",
      value1: 'time="2023/5/22";location:[Zhejiang,Hangzhou;Guangdong,Guangzhou];',
      value: 0,
    },
    {
      label: "异常证书",
      value1: 'time="2022/10/22";location:[Fujian,Xiamen;Jiangsu,Nanjing];',
      value: 1,
    },
  ]);
  const [certificateContents, setCertificateContents] = useState("");

  const clickHandle = ()=>{
    if (props.loginCheck)
    props.loginCheck()
  }

  useEffect(() => {
    setCertificateContents(selectOptions[0].value1);
  }, []);

  const handleChange = (value: number) => {
    console.log(`selected ${value}`);
    setCertificateContents(selectOptions[value].value1);
  };
  const onFinish = (values: userInfo) => {
    values = {...values, password: md5(values.password).toUpperCase()}
    UserLogin<any>(values).then((data) => {
      if (props.source == 'loginCheck'){
        clickHandle()
      }else {
        window.localStorage.setItem(USER_NAME, values.userName);
        naviGate("/sendMessage");
      }
    });
  };

  return (
      <div className={style.bodyContainer}>
        {contextHolder}
        <Title></Title>
        <div className={style.loginContainer}>
          <span className={style.loginTitle}>登录</span>
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
                  >
                    <Input/>
                  </Form.Item>
                  <Form.Item
                      name="password"
                      label="密码"
                      rules={[{required: true}]}
                  >
                    <Input.Password/>
                  </Form.Item>
                  <Form.Item
                      name="type"
                      label="选择证书"
                      // initialValue={1}
                      // rules={[{ required: true }]}
                  >
                    <Select
                        style={{width: 120}}
                        defaultValue={selectOptions[0].value}
                        onChange={handleChange}
                        options={selectOptions}
                    />
                    {/*{*/}
                    {/*  selectOptions[0].value*/}
                    {/*}*/}
                  </Form.Item>
                  <Form.Item wrapperCol={{offset: 6, span: 16}}>
                    <Button type="primary" htmlType="submit">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
            <div className={style.loginCertificate}>
              <div className={style.loginItem}>
                <div className={style.certificateTitle}>所选证书信息：</div>
                <div className={style.certificateContent}>
                  {certificateContents}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
export default Login;
