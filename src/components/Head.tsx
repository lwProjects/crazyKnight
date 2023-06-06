import { useContext, useEffect, useState } from "react";
import "./style.css";
import Context from "../config/Context";
import "../config/interfaceGloble";

export default () => {
  // 拿用户数据
  const users: Users = useContext(Context) as Users;
  // 买箱子
  const buyBoxClick = () => {
    const usersN: User = { ...users.user };
    usersN.U_boxCount += 100;
    users.setUser(usersN);
  };
  return (
    <div className="head">
      <h1>用户名: {users.user.UserId}</h1>
      <h1>等级: {users.user.U_lv}</h1>
      <h1>经验: {users.user.U_lesson}/100</h1>
      <div className="buyBox" onClick={() => buyBoxClick()}>
        买箱子
      </div>
    </div>
  );
};
