import React, {useState} from "react";
import style from './index.module.css'
import {Button, Form, Input, Pagination, Space, Table, Tag} from "antd";
import {useNavigate} from 'react-router-dom'
import {LockOutlined, UserOutlined} from "@ant-design/icons";

interface DataType {
    key: string;
    username: string;
    address: string;
    lastLoginTime:string;
    accesses:number;
}

const AuthRecord = () => {
    const gotoHistory = (value:string)=>{
        navigate("/authDetail?name="+value)
    }

    const gotoDetail = ()=>{
        navigate("/detail")
    }

    const dataSource = [
        {
            key: '1',
            username: 'aaa',
            lastLoginTime: (new Date()).toLocaleString(),
            address: '西湖区湖底公园1号',
            accesses:1
        },
        {
            key: '2',
            username: 'bbb',
            lastLoginTime: (new Date()).toLocaleString(),
            address: '西湖区湖底公园1号',
            accesses:1
        },
    ];
    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'name',
        },
        {
            title: '上次登录时间',
            dataIndex: 'lastLoginTime',
            key: 'lastLoginTime',
        },
        {
            title: '上次登录地点',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '历史接入次数',
            dataIndex: 'accesses',
            key: 'accesses',
        },
        {
            title: '操作',
            key: 'action',
            render: (_:any,record:DataType) => (
                <Space size="middle">
                    <Button type="link" onClick={()=>gotoHistory(record.username)}>历史轨迹</Button>
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
                <Table dataSource={dataSource} columns={columns} pagination={false}/>
                <Pagination defaultCurrent={1} total={50} />
            </div>

        </div>
    )
}

export default AuthRecord
