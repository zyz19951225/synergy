import React from "react";
import style from "./index.module.css";
import { Avatar, Image } from "antd";

interface MessageParams {
  head: string;
  username: string;
  content: string;
}

const MessageItem = (info: MessageParams) => {
  return (
    <div className={style.messageItem}>
      <div className={style.testBorder}></div>
      <div>
        <Avatar size={40}>{info.head}</Avatar>
      </div>
      <div className={style.item}>
        <div className={style.userName}>{info.username}</div>
        <div className={style.messageContent}>
          {info.content.startsWith("data:image/") ? (
            <Image width={200} src={info.content} />
          ) : (
            <p style={{ wordBreak: "break-all" }}>{info.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
