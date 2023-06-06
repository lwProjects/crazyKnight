import "./App.css";
import axios from "axios";
import { useEffect, useState, createContext, useMemo } from "react";
import Head from "./components/Head";
import Body from "./components/Body";
import Foot from "./components/Foot";
import React from "react";
import kitFun from "./config/kitFun";
import Context from "./config/Context";

// scale 做适配
const resize = (className: string) => {
  const scale =
    "scale(" + (document.documentElement.clientWidth * 100) / 37500 + ")";
  const dom = document.getElementsByClassName(className)[0] as HTMLElement;
  dom.style.transform = scale;
};
// window.addEventListener("resize", () => resize());

function App() {
  // 当前用户数据(不包括四维+特殊)
  const [user, setUser] = useState<User>(kitFun.getInitUser());
  // 拿到用户数据
  const getUser = async () => {
    // const res = await axios.post("http://localhost:3030/crazy/user/query", {
    //   userId: "test",
    // });
    // if (res && res.data.length) setUser(res.data[0]);
  };
  useEffect(() => {
    // 更新app高度
    (document.querySelector(".app") as HTMLElement).style.height =
      document.documentElement.clientHeight + "px";
    // resize();
    getUser();
  }, []);
  return (
    <Context.Provider value={{ user: user, setUser: setUser, resize: resize }}>
      <div className="app">
        <Head />
        <Body />
        <Foot />
      </div>
    </Context.Provider>
  );
}

export default App;
