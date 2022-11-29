import React, {useState} from "react";
import style from './index.module.css'
import {Button, Form, Input, Space, Table, Tag} from "antd";
import {useNavigate} from 'react-router-dom'
import {LockOutlined, UserOutlined} from "@ant-design/icons";

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string
}

const AuthRecord = () => {
    const gotoHistory = (value:string)=>{
        navigate("/history?name="+value)
    }

    const gotoDetail = ()=>{
        navigate("/detail")
    }

    const dataSource = [
        {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
    ];
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_:any,record:DataType) => (
                <Space size="middle">
                    <Button type="link" onClick={()=>gotoHistory(record.name)}>历史轨迹</Button>
                    <Button type="link" onClick={gotoDetail}>认证详情</Button>
                </Space>
            ),
        },
    ];
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        console.log(values);
    };
    const navigate = useNavigate()

    return (
        <div className={style.mainContainer}>
            <div className={style.title}>认证记录</div>
            <div className={style.queryItem}>
                <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        label='用户名'
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item shouldUpdate>
                        {() => (
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                查询
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </div>
            <div className={style.recordTable}>
                <Table dataSource={dataSource} columns={columns} />
            </div>

        </div>
    )
}

export default AuthRecord
