import React, { useEffect, useState } from "react";
import md5 from 'js-md5';
import style from "./index.module.css";
import Title from "../../component/Title";
import { Button, Form, Input, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import {GetCredentialDetail, GetCredentialTypeList, UserLogin} from "../../api";
import { USER_NAME, PASSWORD } from "../../constant/Constant";

interface userInfo {
  username: string;
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

const Login = () => {
  const naviGate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectOptions, setSelectOptions] = useState([
    {
      label: "证书1",
      value:
        'time="2023/5/22";location:[Zhejiang,Hangzhou;Guangdong,Guangzhou];',
    },
    {
      label: "证书2",
      value: 'time="2022/10/22";location:[Fujian,Xiamen;Jiangsu,Nanjing];',
    },
  ]);
  const [certificateContents, setCertificateContents] = useState("");

  useEffect(() => {
    setCertificateContents(selectOptions[0].value);
  });

  // useEffect(() => {
  //   console.log("获取证书信息");
  //   GetCredentialTypeList<Array<CredentialType>>()
  //     .then((data) => {
  //       setSelectOptions(data);
  //       return data[0].value;
  //     })
  //     .then((value) => {
  //       GetCredentialDetail<CredentialDetail>({ value }).then((data) => {
  //         setCertificateContents(data.info);
  //       });
  //     });
  // }, []);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setCertificateContents(value);
  };
  const onFinish = (values: userInfo) => {
    // if (values.username === USER_NAME && values.password === PASSWORD) {
    //   localStorage.setItem(USER_NAME, USER_NAME);
    //   naviGate("/sendMessage");
    // } else {
    //   messageApi.error("用户名或密码错误！");
    // }
   values = {...values,password:md5(values.password).toUpperCase()}
    UserLogin<any>(values).then((data) => {
      localStorage.setItem("token", values.username);
      naviGate("/sendMessage");
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
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
              >
                <Form.Item
                  name="userName"
                  label="用户名"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="type"
                  label="选择证书"
                  // initialValue={1}
                  // rules={[{ required: true }]}
                >
                  <Select
                    style={{ width: 120 }}
                    defaultValue={selectOptions[0].label}
                    onChange={handleChange}
                    options={selectOptions}
                  />
                  {/*{*/}
                  {/*  selectOptions[0].value*/}
                  {/*}*/}
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
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
