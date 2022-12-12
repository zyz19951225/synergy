import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import Title from "../../component/Title";
import { Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { GetCredentialDetail, GetCredentialTypeList, UserLogin } from "../../api";

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
  const [form] = Form.useForm();
  const [selectOptions, setSelectOptions] = useState([] as Array<CredentialType>);
  const [certificateContents, setCertificateContents] = useState("");

  useEffect(() => {
    console.log("获取证书信息");
    GetCredentialTypeList<Array<CredentialType>>()
      .then((data) => {
        setSelectOptions(data);
        return data[0].value;
      })
      .then((value) => {
        GetCredentialDetail<CredentialDetail>({ value }).then((data) => {
          setCertificateContents(data.info);
        });
      });
  }, []);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const onFinish = (values: userInfo) => {
    UserLogin<any>(values).then((data) => {
      localStorage.setItem("user", values.username);
      naviGate("/sendMessage");
    });
  };

  return (
    <div className={style.bodyContainer}>
      <Title></Title>
      <div className={style.loginContainer}>
        <span className={style.loginTitle}>登录</span>
        <div className={style.loginForm}>
          <div className={style.loginLeft}>
            <div className={style.loginItem}>
              <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
                <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>
                <Form.Item name="type" label="选择证书" initialValue={1} rules={[{ required: true }]}>
                  <Select style={{ width: 120 }} onChange={handleChange} options={selectOptions} />
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
              <div className={style.certificateContent}>{certificateContents}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
