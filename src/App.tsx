import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import getRoutes from "./routes/getRoutes";
import "./App.css";
import { Spin } from "antd";

function App() {
  const routes = getRoutes();
  {
    /* todo 需要进行全局路由鉴权-登录, 临时写死变量参数 */
  }
  const isLogin = true;
  return (
    <Suspense fallback={<Spin />}>
      <BrowserRouter>
        <Routes>
          {routes.map((item) => {
            if (isLogin || item.path === "/") {
              return <Route key={item.path} path={item.path} element={item.component}></Route>;
            } else {
              return <Route key={item.path} path="*" element={<Navigate to="/" />}></Route>;
            }
          })}
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
