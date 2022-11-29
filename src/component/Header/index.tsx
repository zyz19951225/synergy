import React from 'react'
import style from './index.module.css'
import logo from '../../asserts/logo.png'
import {DownOutlined, UserOutlined} from "@ant-design/icons";
import {Avatar, Dropdown, MenuProps, message, Space} from "antd";

const Header = () => {
    const onClick: MenuProps['onClick'] = ({ key }) => {
        message.info(`Click on item ${key}`);
    };

    const items: MenuProps['items'] = [
        {
            label: '退出',
            key: '1',
        },
    ];

    return (
        <div className={style['container']}>
            <div className={style.logoTitle}>
                <img src={logo} className={style['logo']}/>
                <span className={style['title']}>天地协同</span>
            </div>
            <div className={style.userName}>
                <Avatar icon={<UserOutlined />} />
                <Dropdown menu={{ items, onClick }} >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                           admin
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </div>

        </div>
    )
}

export default Header
