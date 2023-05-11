import React from "react";
import style from "./index.module.css";
import { Avatar, Image } from "antd";

interface MessageParams {
  head: string;
  username: string;
  content: string;
}

const MessageItemLeft = (info: MessageParams) => {
  return (
    <div className={style.messageItemLeft}>
      <div className={style.testBorder}></div>
      <div>
        <Avatar size={40}>{info.head}</Avatar>
      </div>
      <div className={style.itemLeft}>
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

const MessageItemRight = (info: MessageParams) => {
  return (
    <div className={style.messageItemRight}>
      <div className={style.testBorder}></div>
      <div className={style.itemRight}>
        <div className={style.userName}>{info.username}</div>
        <div className={style.messageContent}>
          {info.content.startsWith("data:image/") ? (
            <Image width={200} src={info.content} />
          ) : (
            <p style={{ wordBreak: "break-all" }}>{info.content}</p>
          )}
        </div>
      </div>
      <div>
        <Avatar size={40}>{info.head}</Avatar>
      </div>
    </div>
  );
};

export { MessageItemLeft, MessageItemRight };
