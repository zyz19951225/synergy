import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import Title from "../../component/Title";
import { Button, Form, Input } from "antd";

interface userInfo {
  userName: string;
  password: string;
  type: number;
}
interface propsType {
  loginCheck: Function;
}

const Login = (props: propsType) => {
  const [form] = Form.useForm();

  const onClick = () => {
    props.loginCheck();
  };

  return (
    <div className={style.bodyContainer}>
      <Title></Title>
      <div className={style.loginContainer}>
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            name="userName"
            label="用户名"
            initialValue={"zjlabUser1"}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            initialValue={"zjlabUser1"}
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="sfzhm"
            label="身份证号码"
            initialValue={"330124199936457512"}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="yzm"
            label="验证码"
            initialValue={"XTCBSFG"}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" onClick={onClick}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Login;
