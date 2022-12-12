import React, { lazy } from "react";
import SendMessage from "../pages/message";

const Login = lazy(() => import("../pages/login"));
const AuthRecord = lazy(() => import("../pages/authRecord"));
const HistoricalRoute = lazy(() => import("../pages/historicalRoute"));
const AuthDetail = lazy(() => import("../pages/authDetail"));

const getRoutes = () => {
  return [
    {
      path: "/",
      component: <Login />
    },
    {
      path: "/sendMessage",
      component: <SendMessage />
    },
    {
      path: "/authDetail",
      component: <AuthDetail />
    },
    {
      path: "/authRecord",
      component: <AuthRecord />
    },
    {
      path: "/history",
      component: <HistoricalRoute />
    }
  ];
};

export default getRoutes;
