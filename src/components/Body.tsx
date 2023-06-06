import { useContext, useEffect, useState } from "react";
import "./style.css";
import "../config/interfaceGloble";
import kitFun from "../config/kitFun";
import OpenBox from "./bodyBox/OpenBox";
import KitDetail from "./bodyBox/KitDetail";
import Activity from "./activityBox/Activity";
import Context from "../config/Context";
import petBox from "./petBox/petBox";
import { message } from "antd";
import PetBox from "./petBox/petBox";

export default () => {
  // 公共杂项实体模块,含用户数据+set方法
  const users: Users = useContext(Context) as Users;
  // console.log(users);
  // 开箱界面开关
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 是否开完了箱子(保留还未做出操作的宝箱)
  const [openAfter, setOpenAfter] = useState<boolean>(false);
  // 遮罩界面开关
  const [shade, setShade] = useState<boolean>(true);
  // 第一次计算属性时为远程调用
  const [isFirstRest, setIsFirstRest] = useState<boolean>(true);
  // 配件区数据
  const [dataSource, setDataSource] = useState<Kit[]>(
    kitFun.getInitKitDataSource()
  );
  // 四维属性+特殊属性
  const [attribute, setAttribute] = useState<AttriKeyValue[]>(
    kitFun.getInitAttribute()
  );
  // 配件详情盒子开关
  const [kitDetail, setKitDetail] = useState<boolean>(false);
  // 当前要查看的配件的数据
  const [kitDetailData, setKitDetailData] = useState<Kit>(dataSource[0]);
  // 配件区数据
  const [activity] = useState<Activity>(kitFun.getActivity());
  // 中场类activity 通用盒子控显示
  const [aBoxVisible, setABoxVisible] = useState<boolean>(false);
  // 宠物模块
  const [petVisible, setPetVisible] = useState<boolean>(true);
  // (初始化所有) 本地计算属性 仅仅第一次计算请求参数值，在后续变动中，计算本地值
  const reset = () => {
    if (isFirstRest) setIsFirstRest(false);
    kitFun.reset(setShade, isFirstRest, setDataSource, setAttribute, {
      kit: dataSource,
      attribute,
    });
  };
  // 发起配件替换或新增接口请求
  const reqSet = async () => {
    // console.log(kitFun.getKit());
    // let obj: any = {
    //   0: 0,
    //   1: 0,
    //   2: 0,
    //   3: 0,
    //   4: 0,
    //   5: 0,
    //   6: 0,
    // };
    // for (let index = 0; index < 100; index++) {
    //   const res = kitFun.getKit();
    //   obj[res.K_quality] += 1;
    // }
    // console.log(obj);
    // console.log(Math.floor(Math.random() * 1000));
    // console.log(kitFun.getOddsRezult(50));
    // const res = await axios.post("http://localhost:3030/crazy/kit/set", {
    //   data: {
    //     type: "insert",
    //     kit: {
    //       K_attack: 100,
    //       K_defense: 50,
    //       K_hp: 1000,
    //       K_quality: 0,
    //       K_sAttrType: 0,
    //       K_sAttrValue: 5.5,
    //       K_speed: 20,
    //       K_type: 7,
    //       UserId: "test",
    //       K_lv: 10,
    //     },
    //   },
    // });
  };
  // 开一次宝箱(随一次配件)
  const openbox = () => {
    if (!users.user.U_boxCount) {
      message.error("没有箱子了");
      return;
    }
    setIsOpen(true);
    setOpenAfter(true);
  };
  // 装备详情盒子配套的开启事件
  const openKitDetailBox = (item: Kit) => {
    if (item.K_quality === -1) return;
    setKitDetailData(item);
    setKitDetail(true);
  };
  // activity 委托事件
  const activityClick = (key: string) => {
    setABoxVisible(true);
  };
  // 仅仅第一次计算请求参数值，在后续变动中，计算本地值
  useEffect(() => {
    reset();
  }, [dataSource]);
  // 初始化钩子
  useEffect(() => {
    // 需要适配的盒子
    users.resize("body");
    users.resize("activity");
  }, []);
  // 遮罩层关闭统一监听项
  useEffect(
    () => setShade(isOpen || kitDetail || aBoxVisible),
    [isOpen, kitDetail, aBoxVisible]
  );
  return (
    <>
      {/* 装备+属性模块 */}
      <div className="body">
        <div className="bodyLeft">
          {dataSource.map((item: Kit) => (
            <div
              key={item.K_type}
              className="kitBox"
              onClick={() => openKitDetailBox(item)}
              style={{
                background: kitFun.getKitQuality(item.K_quality).bg,
                lineHeight: item.K_lv !== undefined ? "50px" : "55px",
              }}
            >
              {item.K_lv !== undefined ? kitFun.getKitName(item.K_type) : null}
              {item.K_lv !== undefined ? <span>Lv.{item.K_lv}</span> : "未获得"}
            </div>
          ))}
        </div>
        <div className="bodyRight">
          <div className="rTop">
            {attribute.map((item: AttriKeyValue) => {
              if (item.key < 100) return null;
              return (
                <div key={item.key}>
                  <h1>{item.keyName}:</h1>
                  <h1>{item.value}</h1>
                </div>
              );
            })}
          </div>
          <div className="rBottom">
            {attribute.map((item: AttriKeyValue) => {
              if (item.key > 5) return null;
              return (
                <div key={item.key}>
                  <h1>{item.keyName}:</h1>
                  <h1>{item.value}%</h1>
                </div>
              );
            })}
            <span onClick={() => reqSet()}>详细信息</span>
          </div>
        </div>
      </div>
      {/* 整体操作模块 开箱+活动+对战 */}
      <div className="activity">
        {/* 开箱子 */}
        <div className="openBox" onClick={() => openbox()}>
          {openAfter ? "已开启" : "开箱"}
        </div>
        <p className="boxCount">数量: {users.user.U_boxCount}</p>
        {/* 左边界 冒险+爬塔+野外首领 */}
        <div className="activity_left">
          {activity.left.map((item: KeyValue) => (
            <div key={item.key}>
              <div
                className="activity_bgBox"
                style={{ background: item.bgValue || "deepskyblue" }}
                onClick={() => activityClick(item.key)}
              ></div>
              <span key={item.name}>{item.name}</span>
            </div>
          ))}
        </div>
        {/* 右边界 钓鱼场+竞技场+领地 */}
        <div className="activity_right">
          {activity.right.map((item: KeyValue) => (
            <div key={item.key}>
              <div
                className="activity_bgBox"
                style={{ background: item.bgValue || "deepskyblue" }}
                onClick={() => activityClick(item.key)}
              ></div>
              <span key={item.name}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 临时隐藏下 */}
      <>
        {/* 遮罩层盒子 */}
        <div
          className="shadeBox"
          style={{
            visibility: shade ? "visible" : "hidden",
          }}
          // onClick={() => openbox()}
        />
        {/* 开箱替换盒子 */}
        <OpenBox
          dataSource={dataSource}
          setDataSource={setDataSource}
          visibility={isOpen}
          setVisibility={setIsOpen}
          openAfter={openAfter}
          setOpenAfter={setOpenAfter}
        />
        {/* 配件详情 */}
        {kitDetail && (
          <KitDetail
            visible={{ visible: kitDetail, setVisible: setKitDetail }}
            setShade={setShade}
            data={kitDetailData}
          />
        )}
        {/* 中场类activity 通用盒子 */}
        {aBoxVisible && (
          <Activity attribute={attribute} setVisible={setABoxVisible} />
        )}
        {/* 宠物模块盒子 */}
        {petVisible && <PetBox setVisible={setPetVisible} />}
      </>
    </>
  );
};
