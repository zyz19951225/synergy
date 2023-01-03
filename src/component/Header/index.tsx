import React from "react";
import style from "./index.module.css";
import logo from "../../asserts/logo.png";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps, message, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { USER_NAME } from "../../constant/Constant";

const Header = () => {
  const naviGate = useNavigate();

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "1") {
      localStorage.removeItem(USER_NAME);
      naviGate("/");
    }
  };
  const items: MenuProps["items"] = [
    {
      label: "退出",
      key: "1",
    },
  ];

  return (
    <div className={style["container"]}>
      <div className={style.logoTitle}>
        <img src={logo} className={style["logo"]} />
        <span className={style["title"]}>天地协同</span>
      </div>
      <div className={style.userName}>
        <Avatar icon={<UserOutlined />} />
        <Dropdown menu={{ items, onClick }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {localStorage.getItem(USER_NAME) || "未登录"}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
