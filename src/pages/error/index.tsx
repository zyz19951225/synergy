import style from "./index.module.css";
import { FrownOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const naviGate = useNavigate();

  const backToHome = () => {
    console.log(".....");
    naviGate("/");
  };
  return (
    <div className={style.content}>
      <div>
        <FrownOutlined style={{ fontSize: "10em" }} />
        <div style={{ fontSize: "3em" }}>404</div>
        <div style={{ fontSize: "3em" }}>Page not found</div>
      </div>
      <div className={style.backHome}>
        <Button type="primary" onClick={backToHome}>
          返回首页
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
