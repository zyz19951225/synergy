import React from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import getRoutes from "./routes/getRoutes";
import "./App.css";

function App() {
  const routes = useRoutes(getRoutes());
  return <>{routes}</>;
}

export default App;
