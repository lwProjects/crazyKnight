import "../style.css";
import "../../config/interfaceGloble";
import kitFun from "../../config/kitFun";
import { useContext, useEffect, useState } from "react";
import Context from "../../config/Context";
import { message } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

export default (props: OpenBox) => {
  const {
    dataSource,
    setDataSource,
    visibility,
    setVisibility,
    openAfter,
    setOpenAfter,
  } = props;
  // 公共杂项实体模块,含用户数据+set方法
  const users: Users = useContext(Context) as Users;
  // 开箱得到的配件
  const [kitData, setKitData] = useState<Kit>({ K_type: 0, K_quality: 0 });
  // 当前穿身上的配件
  const [currentData, setCurrentData] = useState<Kit>(dataSource[0]);
  // 属性值相比较判断上升还是下降,拿对应的icon
  const getSortRezult = (item: string, newV: number) => {
    item = item === "K_sAttrType" ? "K_sAttrValue" : item;
    if (currentData[item] === newV) return "";
    return currentData[item] > newV ? (
      <ArrowDownOutlined style={{ color: "red" }} />
    ) : (
      <ArrowUpOutlined style={{ color: "green" }} />
    );
  };
  // 以key为左值，只拿存在特殊+四维转换的key值
  const getNode = (item: string, index: number, data: Kit) => {
    if (kitFun.getKitAttrType(item) === "" && item !== "K_sAttrType")
      return null;
    const leftV = kitFun.getKitAttrType(
      item === "K_sAttrType" ? (Object.values(data)[index] as number) : item
    );
    const rightV =
      item === "K_sAttrType"
        ? data["K_sAttrValue"]
        : (Object.values(data)[index] as number);
    const node = (
      <>
        <span>
          {leftV}: {data === kitData ? getSortRezult(item, rightV || 0) : ""}
        </span>
        <span>
          {rightV}
          {item === "K_sAttrType" && "%"}
        </span>
      </>
    );
    return (
      <div key={item} className="kitBoxAttri">
        {item === "K_sAttrType" && !data["K_sAttrValue"] ? <></> : node}
      </div>
    );
  };
  // 公共化配件开箱所得插槽
  const getNodeBox = (data: Kit) => {
    return (
      <>
        <div className="kitBoxLeft">
          <div
            style={{
              height: "100%",
              background: kitFun.getKitQuality(data.K_quality).bg,
            }}
          >
            <p>{`${data.K_quality === -1 ? "" : "Lv." + data.K_lv}`}</p>
          </div>
        </div>
        <div className="kitBoxRight">
          {Object.keys(data).map((item: string, index: number) =>
            getNode(item, index, data)
          )}
          <p style={{ color: kitFun.getKitQuality(data.K_quality).bg }}>{`[${
            kitFun.getKitQuality(data.K_quality).name
          }${data.K_quality === -1 ? "" : "的"}]${
            data.K_quality === -1 ? "" : kitFun.getKitName(data.K_type)
          }`}</p>
        </div>
      </>
    );
  };
  // 出售事件 // 未做数据库层面curd
  const sellClick = () => {
    // 这里把主界面身上的装备替换
    const newD = JSON.parse(JSON.stringify(dataSource));
    newD.splice(
      newD.findIndex((item: Kit) => item.K_type === currentData.K_type),
      1,
      currentData
    );
    // 这里做经验和等级开箱变动
    if (kitData.K_quality !== -1) {
      const userNew: User = { ...users.user };
      if (kitData.K_quality + 5 + userNew.U_lesson >= 100) {
        userNew.U_lv += 1;
        userNew.U_lesson = kitData.K_quality + 5 + userNew.U_lesson - 100;
        message.success("升级了");
        // if (userNew.U_lv > 100) userNew.U_lv = 100;
      } else {
        userNew.U_lesson += kitData.K_quality + 5;
      }
      users.setUser(userNew);
    }
    // 数据重渲染
    setDataSource(newD);
    setOpenAfter(false);
    setVisibility(false);
  };
  // 装备事件
  const fitClick = () => {
    const newKit = { ...kitData };
    const currentKit = { ...currentData };
    setCurrentData(newKit);
    setKitData(currentKit);
  };
  // 初始化钩
  // useEffect(() => {
  //   users.resize();
  // }, []);
  // 开箱回调
  useEffect(() => {
    if (openAfter) {
      const res: Kit = kitFun.getKit(users.user.U_lv);
      const userNew: User = { ...users.user };
      userNew.U_boxCount--;
      users.setUser(userNew);
      setKitData(res);
      setCurrentData(
        dataSource.find((item: Kit) => item.K_type === res.K_type) ||
          dataSource[0]
      );
    }
  }, [openAfter]);

  return (
    <div
      className="updateBox"
      style={{ visibility: visibility ? "visible" : "hidden" }}
    >
      <div className="currentKitBox">
        {getNodeBox(currentData)}
        <div className="kitBoxTitle">身上的</div>
        <div className="close" onClick={() => setVisibility(false)}>
          关闭
        </div>
      </div>
      <div className="newKitBox">
        {getNodeBox(kitData)}
        <div className="kitBoxTitle">将出售</div>
      </div>
      <div className="handle">
        <div className="sell" onClick={() => sellClick()}>
          出售
        </div>
        <div className="fit" onClick={() => fitClick()}>
          装备
        </div>
      </div>
    </div>
  );
};
