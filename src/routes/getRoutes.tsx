import React, { lazy } from "react";
import { AuthRoute } from "../component/AuthRoute";

const Login = lazy(() => import("../pages/login"));
const SendMessage = lazy(() => import("../pages/message"));
const AuthRecord = lazy(() => import("../pages/authRecord"));
const HistoricalRoute = lazy(() => import("../pages/historicalRoute"));
const AuthDetail = lazy(() => import("../pages/authDetail"));
const ErrorPage = lazy(() => import("../pages/error"));

const getRoutes = () => {
  return [
    {
      path: "/",
      element: <Login source={undefined} loginCheck={undefined} />,
    },
    {
      path: "/sendMessage",
      element: (
        <AuthRoute>
          <SendMessage />
        </AuthRoute>
      ),
    },
    {
      path: "/authDetail",
      element: <AuthDetail />,
    },
    {
      path: "/authRecord",
      element: <AuthRecord />,
    },
    {
      path: "/history",
      element: <HistoricalRoute />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];
};

export default getRoutes;
