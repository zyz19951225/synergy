import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import { Button, Form, Input, Pagination, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { GetAuthRecordList } from "../../api";

interface DataType {
  total: number;
  current: number;
  data: Array<RecordType>;
}
interface RecordType {
  key: string;
  username: string;
  address: string;
  lastLoginTime: string;
  accesses: number;
}

const AuthRecord = () => {
  const [userRecords, setUserRecords] = useState<DataType>({} as DataType);

  useEffect(() => {
    //页面初始化获取认证记录
    GetAuthRecordList<DataType>({ username: "" }).then((data) => {
      setUserRecords(data);
    });
  }, []);

  const gotoHistory = (value: string) => {
    navigate("/authDetail?name=" + value);
  };

  const gotoDetail = () => {
    navigate("/history");
  };

  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "name",
    },
    {
      title: "上次登录时间",
      dataIndex: "lastLoginTime",
      key: "lastLoginTime",
    },
    {
      title: "上次登录地点",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "历史接入次数",
      dataIndex: "accesses",
      key: "accesses",
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: RecordType) => (
        <Space size="middle">
          <Button type="link" onClick={() => gotoHistory(record.username)}>
            认证详情
          </Button>
          <Button type="link" onClick={gotoDetail}>
            历史轨迹
          </Button>
        </Space>
      ),
    },
  ];
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log(values);
    //根据参数查询数据
    GetAuthRecordList<DataType>(values).then((data) => {
      setUserRecords(data);
    });
  };
  const navigate = useNavigate();

  return (
    <div className={style.mainContainer}>
      <div className={style.title}>认证记录</div>
      <div className={style.queryItem}>
        <Form
          form={form}
          name="horizontal_login"
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
      <div className={style.recordTable}>
        <Table
          dataSource={userRecords.data}
          columns={columns}
          pagination={false}
        />
        <Pagination
          defaultCurrent={userRecords.current}
          total={userRecords.total}
        />
      </div>
    </div>
  );
};

export default AuthRecord;
