import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const div = document.getElementById("root");
const root = ReactDOM.createRoot(div as HTMLElement);
// if (div) {
//   div.style.fontSize = (document.documentElement.clientWidth / 375) * 1 + "px";
//   div.style.height = document.documentElement.clientHeight + "px";
// }

root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
