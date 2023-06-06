import "./style.css";
import "../style.css";
import Context from "../../config/Context";
import { useContext, useEffect } from "react";
import kitFun from "../../config/kitFun";

export default (props: { visible: Visible; data: Kit; setShade: Function }) => {
  const { data, visible, setShade } = props;
  // 公共杂项实体模块,含用户数据+set方法
  const users: Users = useContext(Context) as Users;
  // 关闭事件
  const close = () => {
    setShade(false);
    visible.setVisible(false);
  };
  // 初始化
  useEffect(() => {
    users.resize("kitDetailBox");
  }, []);
  return (
    // 用于开启flex布局适配
    <div className="kitDetail">
      {/* 主窗体 */}
      <div className="kitDetailBox">
        {/* 左边盒子 */}
        <div className="kitDetailBoxL">
          <div
            className="kitDetaiBg"
            style={{ background: kitFun.getKitQuality(data.K_quality).bg }}
          >
            <p>{kitFun.getKitName(data.K_type)}</p>
            <span>Lv.{data.K_lv}</span>
          </div>
        </div>
        {/* 右边属性盒子 */}
        <div className="kitDetailBoxR">
          {/* 品质+部位 */}
          <h1
            style={{
              textAlign: "center",
              fontSize: "16px",
              color: kitFun.getKitQuality(data.K_quality).bg,
            }}
          >{`[${
            kitFun.getKitQuality(data.K_quality).name
          }]的${kitFun.getKitName(data.K_type)}`}</h1>
          {/* 四维属性 */}
          <div className="kitDetailBase">
            <div>
              <h1>速度:</h1>
              <h1>{data.K_speed}</h1>
            </div>
            <div>
              <h1>生命:</h1>
              <h1>{data.K_hp}</h1>
            </div>
            <div>
              <h1>攻击:</h1>
              <h1>{data.K_attack}</h1>
            </div>
            <div>
              <h1>防御:</h1>
              <h1>{data.K_defense}</h1>
            </div>
          </div>
          {/* 特殊属性 special + 忽视 */}
          <div className="kitDetailSpecial">
            <div
              style={{ visibility: data.K_quality > 1 ? "visible" : "hidden" }}
            >
              <h1>{kitFun.getKitAttrType(data.K_sAttrType || 0)}:</h1>
              <h1>{data.K_sAttrValue + "%"}</h1>
            </div>
          </div>
          {/* 固定关闭按钮 */}
          <div className="close" onClick={() => close()}>
            关闭
          </div>
        </div>
      </div>
    </div>
  );
};
