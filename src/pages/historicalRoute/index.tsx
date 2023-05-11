import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import { Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import initBMapGL from "../../utils/BMapGL";

//用户属性类型
interface FactorParams {
  "Traffic Volume": number;
  "Service Type": number;
  "Transverse Index of BS": number;
  "Longitudinal Index of BS": number;
  "Distance between BS and User": number;
  "Elevation between BS and Satellite": number;
  "Index of Satellite": number;
  "Velocity of User": number;
  "Latitude of User": number;
  "Longitude of User": number;
  Course: number;
  "Turn angle": number;
  "Overall speed": number;
  "Accelerated velocity": number;
  Sinuosity: number;
  Flag: number;
  Longitude: number;
  Latitude: number;
}

const HistoricalRoute = () => {
  let userFileList = ["Dataset_20230222_present_User1_hefa.csv"];

  const [options, setOptions] = useState([
    {
      value: "",
      label: "",
    },
  ]);

  const [currentUser, setCurrentUser] = useState(
    "Dataset_20230222_present_User1_hefa.csv"
  );

  const navigate = useNavigate();

  //获取所有的用户轨迹文件名称 循环生成用户选择列表
  useEffect(() => {
    let userList = userFileList.map((cur: string) => {
      return {
        value: cur,
        label: cur,
      };
    });
    setOptions(userList);
    showUserTrack(userList[0].value);
  }, []);

  //展示对应用户轨迹
  const showUserTrack = (value: string) => {
    setCurrentUser(value);
    axios.get("/static/user/" + value).then((res) => {
      Papa.parse(res.data, {
        worker: true,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete(results: any) {
          updateMap(results.data);
        },
      });
    });
  };

  const updateMap = (results: any) => {
    initBMapGL(results, null, true);
  };

  const backToAuthHistory = () => {
    navigate("/authRecord");
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  return (
    <>
      <div className={style.header}>
        <Button
          type="text"
          className={style.backbtn}
          onClick={backToAuthHistory}
        >
          返回
        </Button>
        aaa的历史轨迹
      </div>
      <div className={style.mainContainer}>
        <div className={style.chooseContainer}>
          <div>
            <Select
              style={{ width: 300 }}
              showSearch
              placeholder="select user code"
              optionFilterProp="children"
              onChange={showUserTrack}
              onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              defaultValue={currentUser}
              options={options}
            />
          </div>
        </div>
        <div className={style.mapContainer} id="container"></div>
      </div>
    </>
  );
};

export default HistoricalRoute;
