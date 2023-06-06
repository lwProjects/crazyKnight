import { useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import Context from "../../config/Context";
import kitFun from "../../config/kitFun";

// 对战结束
let isOver = false;
// 回合制开关
let fightIsOver = 0;
// 击晕判断 被击晕将跳过进攻回合
let isStunA = false;
let isStunB = false;
// 用户左当前血量 与 最大血量
let persionA = 0;
let persionAMax = 0;
// 用户右当前血量 与 最大血量
let persionB = 0;
let persionBMax = 0;
export default (props: {
  attribute: AttriKeyValue[];
  setVisible: Function;
}) => {
  const { attribute, setVisible } = props;
  // 公共杂项实体模块,含用户数据+set方法
  const users: Users = useContext(Context) as Users;
  // 左用户 dom
  const userLeft = useRef<HTMLDivElement>(null);
  // 右敌对 dom
  const userRight = useRef<HTMLDivElement>(null);
  // 把进攻轮逻辑提取出来
  const attack = (
    ft: Fight,
    ix: number,
    hurtObjLength: number,
    iL: boolean,
    beatBack: boolean
  ) => {
    if (userLeft.current && userRight.current && !isOver) {
      // 这里分辨出进攻者与被攻击者
      const userF = iL ? userLeft.current : userRight.current;
      const userG = iL ? userRight.current : userLeft.current;
      // [0]挥刀盒子 [1]扣血盒子 [2]血条盒子 [3]tip盒子 [4]眩晕动画盒子
      const fight = userF.childNodes[0] as HTMLDivElement;
      const reduceBlood = userG.childNodes[1] as HTMLDivElement;
      const blodd = (userG.childNodes[2] as HTMLDivElement)
        .childNodes[0] as HTMLDivElement;
      const fightTipL = userF.childNodes[3] as HTMLDivElement;
      const fightTipR = userG.childNodes[3] as HTMLDivElement;
      const vertigoR = userG.childNodes[4] as HTMLDivElement;
      const animation = iL ? "L" : "R";
      go(() => {
        // 挥刀
        go(() => (fight.style.animation = `userFight${animation} .5s`), 0);
        // 扣血
        go(() => {
          if (ft.hurt > 0) {
            reduceBlood.innerText = `-${ft.hurt}`;
            // 触发暴击，扣血飘红
            if (ft.double) {
              reduceBlood.style.fontWeight = "bold";
              reduceBlood.style.color = "red";
            }
            // 触发眩晕
            if (ft.vertigo && userLeft.current)
              vertigoR.style.animation = "vertigo .5s";
            reduceBlood.style.animation = `reduceBloodU${animation} .5s`;
            fightTipL.innerText = !beatBack
              ? ix < hurtObjLength - 1
                ? "连击"
                : ""
              : "反击";
          } else {
            fightTipR.innerText = "闪避";
          }
        }, 0.5);
        // 动画进行完就清空动画
        go(() => {
          reduceBlood.innerText = "";
          if (ft.double) {
            reduceBlood.style.fontWeight = "";
            reduceBlood.style.color = "";
          }
          if (ft.vertigo && userLeft.current) vertigoR.style.animation = "";
          fight.style.animation = "";
          reduceBlood.style.animation = "";
          fightTipL.innerText = "";
          fightTipR.innerText = "";
          if (iL) {
            persionB -= ft.hurt;
            if (persionB <= 0) {
              persionB = 0;
              over(true);
            }
            blodd.style.width = (persionB / persionBMax) * 100 + "%";
          } else {
            persionA -= ft.hurt;
            if (persionA <= 0) {
              persionA = 0;
              over(false);
            }
            blodd.style.width = (persionA / persionAMax) * 100 + "%";
          }
        }, 1);
      }, 1.1 * (ix + 1));
    }
  };
  // 左用户进攻
  const userLeftFigth = () => {
    if (isOver) return;
    if (fightIsOver === 2) {
      fightIsOver = 0;
      fighting();
      return;
    }
    fightIsOver++;
    if (isStunA) {
      isStunA = false;
      fighting();
      return;
    }
    if (userLeft.current) {
      userLeft.current.style.zIndex = "999";
      userLeft.current.style.marginLeft = "200px";
    }
    const hurtObj: Fight[] = getHurtV(userLAtt, userRAtt); // 拿到进攻轮
    let fightOver: number = hurtObj.length;
    // 开始循环进攻
    hurtObj.forEach((ft: Fight, ix: number) => {
      console.log(123);
      if (persionA > 0 && persionB > 0)
        attack(ft, ix, hurtObj.length, true, false);
    });
    // 反击会打断连击，判断最后一位进攻轮是否反击了
    if (hurtObj[hurtObj.length - 1].beatBack && !isOver) {
      console.log(456);
      fightOver += 1;
      const ft = hurtObj[hurtObj.length - 1];
      go(() => attack(ft, 0, 0, false, true), 1.1 * hurtObj.length);
    }
    go(() => {
      if (userLeft.current && !isOver) {
        userLeft.current.style.zIndex = "99";
        userLeft.current.style.marginLeft = "";
      }
      go(() => {
        userRightFigth();
      }, 1.3);
    }, 1.1 * fightOver + 1.1);
  };
  // 右敌对进攻
  const userRightFigth = () => {
    if (isOver) return;
    if (fightIsOver === 2) {
      fightIsOver = 0;
      fighting();
      return;
    }
    fightIsOver++;
    if (isStunB) {
      isStunB = false;
      fighting();
      return;
    }
    if (userRight.current) {
      userRight.current.style.zIndex = "999";
      userRight.current.style.marginRight = "200px";
    }
    const hurtObj: Fight[] = getHurtV(userRAtt, userLAtt); // 拿到进攻轮
    let fightOver: number = hurtObj.length;
    // 开始循环进攻
    hurtObj.forEach((ft: Fight, ix: number) => {
      if (persionA > 0 && persionB > 0 && !isOver)
        attack(ft, ix, hurtObj.length, false, false);
    });
    // 反击会打断连击，判断最后一位进攻轮是否反击了
    if (hurtObj[hurtObj.length - 1].beatBack && !isOver) {
      fightOver += 1;
      const ft = hurtObj[hurtObj.length - 1];
      go(() => attack(ft, 0, 0, true, true), 1.1 * hurtObj.length);
    }
    go(() => {
      if (userRight.current && !isOver) {
        userRight.current.style.zIndex = "99";
        userRight.current.style.marginRight = "";
      }
      go(() => {
        userLeftFigth();
      }, 1.3);
    }, 1.1 * fightOver + 1.1);
  };
  // 公用find方法 用key去属性组里面拿 属性对象中的value
  const getVBK = (arr: AttriKeyValue[], key: number) =>
    arr.find((item: AttriKeyValue) => item.key === key)?.value || 0;
  // 伤害净值计算: 攻击 - 防御
  const getHurt = (persionA: AttriKeyValue[], persionB: AttriKeyValue[]) =>
    getVBK(persionA, 102) - getVBK(persionB, 103) ||
    getVBK(persionA, 102) * 0.2;
  // 伤害统值算法
  const getHurtV = (persionA: AttriKeyValue[], persionB: AttriKeyValue[]) => {
    const hurt = getHurt(persionA, persionB);
    // 特殊:击晕，连击，反击，暴击，闪避，吸血 有效:(perA值- perB忽视属性)
    const maybe: number[] = [];
    for (let i = 0; i < 6; i++) {
      maybe.push(getVBK(persionA, i) - getVBK(persionB, i + 6));
    }
    // 优先计算连击,连击连续触发,触发时概率减10%
    let continues: Fight[] = [];
    const next = (num: number) => {
      const res1 = kitFun.getOddsRezult(num);
      const res2 = kitFun.getOddsRezult(maybe[2]);
      const res3 = kitFun.getOddsRezult(maybe[3]);
      const res4 = kitFun.getOddsRezult(maybe[4]);
      let beatBack_D = false;
      let beatBack_V = false;
      let beatBackV = 0;
      if (res2) {
        const miss = kitFun.getOddsRezult(
          getVBK(persionB, 4) - getVBK(persionA, 10)
        );
        beatBack_D = kitFun.getOddsRezult(
          getVBK(persionB, 3) - getVBK(persionA, 9)
        );
        beatBack_V = miss
          ? false
          : kitFun.getOddsRezult(getVBK(persionB, 0) - getVBK(persionA, 6));
        beatBackV = beatBack_D
          ? getHurt(persionB, persionA) * 2
          : miss
          ? 0
          : getHurt(persionB, persionA);
        num = 0;
      }
      continues.push({
        hurt: res3 ? hurt * 2 : res4 ? 0 : hurt,
        vertigo: res4 ? false : kitFun.getOddsRezult(maybe[0]),
        beatBack: res2,
        double: res3,
        sucking: maybe[5] * hurt,
        beatBackV,
        beatBack_D,
        beatBack_V,
      });
      if (num > 0 && res1) next(num - 10);
    };
    next(maybe[1]);
    return continues;
  };
  // 属性键值对添尾事件（增加最大生命值）用于 % 效果显示
  const addMaxHp = () => {
    persionA = getVBK(userLAtt, 101);
    persionAMax = getVBK(userLAtt, 101);
    persionB = getVBK(userRAtt, 101);
    persionBMax = getVBK(userRAtt, 101);
  };
  // 封装延时器
  const go = (fun: Function, s: number) => setTimeout(fun, s * 1000);
  // 主流程事件函数,待初始化后开启
  const fighting = () => {
    setRound(round + 1);
    go(() => {
      // 左速 > 右速 则左侧先进攻
      // if (getVBK(userLAtt, 100) > getVBK(userRAtt, 100)) {
      userLeftFigth();
      // } else {
      //   userRightFigth();
      // }
    }, 0.3);
  };
  // 结束事件
  const over = (win: boolean) => {
    isOver = true;
    setOverTip(win ? "挑战成功" : "挑战失败");
    setShade(true);
  };
  // 二级遮罩层开关
  const [shade, setShade] = useState<boolean>(false);
  // 结束盒子tips
  const [overTip, setOverTip] = useState<string>("挑战成功");
  // 左用户属性(自己) 100-速度,101-生命,102-攻击,103-防御;0-5 击晕,连击,反击,暴击,闪避,吸血
  const [userLAtt] = useState<AttriKeyValue[]>(
    JSON.parse(JSON.stringify(attribute))
  );
  // 右用户属性
  const [userRAtt] = useState<AttriKeyValue[]>(
    JSON.parse(JSON.stringify(attribute))
  );
  // 第 ? 回合
  const [round, setRound] = useState<number>(0);
  // 初始化
  useEffect(() => {
    // 需要适配的盒子
    users.resize("activity_content");
    addMaxHp();
    fighting();
  }, []);
  // 销毁钩子
  useEffect(
    () => () => {
      fightIsOver = 0;
      isOver = false;
      persionA = 0;
      persionAMax = 0;
      persionB = 0;
      persionBMax = 0;
      isStunA = false;
      isStunB = false;
    },
    []
  );
  return (
    <div className="activityBox">
      <div className="activity_content">
        {/* 回合数盒子 */}
        <div className="turnBase" onClick={() => setVisible(false)}>
          第 {round} 回合
        </div>
        {/* 左用户盒子组 */}
        <div
          ref={userLeft}
          className="userLeft"
          // onClick={() => userLeftFigth()}
        >
          {/* 武器 位置 */}
          <div className="fight" />
          {/* 扣血 位置 */}
          <div className="reduceBlood"></div>
          {/* 血条 位置 */}
          <div className="bloods">
            <div
              className="blood"
              style={{
                width: "100%",
              }}
            ></div>
          </div>
          {/* 特殊效果触发提示文字 位置 */}
          <div className="fightTip"></div>
          {/* 眩晕动画 */}
          <div className="vertigo"></div>
        </div>
        {/* 右敌对盒子组 */}
        <div
          ref={userRight}
          className="userRight"
          // onClick={() => userRightFigth()}
        >
          <div className="fight" />
          <div className="reduceBlood"></div>
          <div className="bloods">
            <div
              className="blood"
              style={{
                width: "100%",
              }}
            ></div>
          </div>
          <div className="fightTip"></div>
          <div className="vertigo"></div>
        </div>
        {/* 二级遮罩层 + 结束盒子 */}
        {shade && (
          <>
            <div className="shade"></div>
            <div className="overBox">
              {overTip}
              <div onClick={() => setVisible(false)}>离开</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
