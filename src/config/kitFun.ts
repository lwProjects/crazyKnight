import axios from "axios";
import "./interfaceGloble";

// 配件:护肩，头铠，项链，护腕，铠甲，拳套，裤铠，武器，戒指，靴子，盾牌
const getKitName = (type: number) => {
  switch (type) {
    case 0:
      return "护肩";
    case 1:
      return "头铠";
    case 2:
      return "项链";
    case 3:
      return "护腕";
    case 4:
      return "铠甲";
    case 5:
      return "拳套";
    case 6:
      return "裤铠";
    case 7:
      return "武器";
    case 8:
      return "戒指";
    case 9:
      return "靴子";
    case 10:
      return "盾牌";
    default:
      return "配件";
  }
};
// 品质:普通40%->精致60%->稀有80%->史诗100%->传说120%->神赐140%->神铸160%
const getKitQuality = (quality: number) => {
  switch (quality) {
    case 0:
      return { name: "普通", bg: "rgb(255, 255, 240)" };
    case 1:
      return { name: "精致", bg: "rgb(194, 233, 200)" };
    case 2:
      return { name: "稀有", bg: "rgb(162, 31, 147)" };
    case 3:
      return { name: "史诗", bg: "rgb(234, 228, 139)" };
    case 4:
      return { name: "传说", bg: "rgb(254, 221, 7)" };
    case 5:
      return { name: "神赐", bg: "rgb(237, 93, 67)" };
    case 6:
      return { name: "神铸", bg: "rgb(47, 187, 214)" };
    default:
      return { name: "未获得", bg: "rgb(255, 223, 162)" };
  }
};
// 特殊:击晕，连击，反击，暴击，闪避，吸血 + 加成属性 + 四维混合
const getKitAttrType = (sAttrType: number | string) => {
  switch (sAttrType) {
    case 0:
      return "击晕";
    case 1:
      return "连击";
    case 2:
      return "反击";
    case 3:
      return "暴击";
    case 4:
      return "闪避";
    case 5:
      return "吸血";
    case 6:
      return "忽视击晕";
    case 7:
      return "忽视连击";
    case 8:
      return "忽视反击";
    case 9:
      return "忽视暴击";
    case 10:
      return "忽视闪避";
    case 11:
      return "忽视吸血";
    case 12:
      return "泥泞";
    case 13:
      return "暴虐";
    case 13:
      return "仁爱";
    case 100:
    case "K_speed":
      return "速度";
    case 101:
    case "K_hp":
      return "生命";
    case 102:
    case "K_attack":
      return "攻击";
    case 103:
    case "K_defense":
      return "防御";
    default:
      return "";
  }
};
// 拿区间随机数
const getSection = (min: number, max: number, pow: number) => {
  const powS = Math.pow(10, pow);
  const minNum = min * powS;
  const maxNum = max * powS;
  const random = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  // console.log(Number(random.toString().split(".")[0]) / powS);
  return Number(random.toString().split(".")[0]) / powS;
};
// 特殊值品质稀有起步(2)稀有0.81~1.22->史诗1.62~2.12->传说2.22~3.18->神赐3.84~4.24->神铸5.62~6.22
const getKitAttrValue = (quality: number) => {
  const oddsArry = [
    { min: 0, max: 0 },
    { min: 0, max: 0 },
    { min: 0.81, max: 1.22 },
    { min: 1.62, max: 2.12 },
    { min: 2.22, max: 3.18 },
    { min: 3.84, max: 4.24 },
    { min: 5.62, max: 7.22 },
  ];

  return getSection(oddsArry[quality].min, oddsArry[quality].max, 2);
};
// 获得初始化用户数据
const getInitUser = () => {
  const user: User = {
    U_lv: 999,
    U_lesson: 99,
    U_boxCount: 999,
  };
  return user;
};
// 获得初始化配件数据组
const getInitKitDataSource = () => {
  const dataSourceT: Kit[] = [];
  for (let index = 0; index < 11; index++) {
    dataSourceT.push({ K_type: index, K_quality: -1 });
  }
  return dataSourceT;
};
// 获得初始化四维属性和特殊属性
const getInitAttribute = () => {
  const dataSourceT: AttriKeyValue[] = [];
  for (let index = 0; index < 12; index++) {
    dataSourceT.push({ key: index, keyName: getKitAttrType(index), value: 0 });
  }
  const dataSourceB: AttriKeyValue[] = [];
  for (let index = 100; index < 104; index++) {
    dataSourceT.push({ key: index, keyName: getKitAttrType(index), value: 0 });
  }
  return dataSourceT.concat(dataSourceB);
};
// 计算属性
const reset = async (
  setShade: Function,
  isFirst: boolean,
  setDataSource: Function,
  setAttribute: Function,
  allSystem: System
) => {
  // 第一次做接口查询，在useEfect二次回调触发时进行属性计算，后续只做计算操作
  if (isFirst) {
    // // 配件接口
    // const res = await axios.post("http://localhost:3030/crazy/kit/query", {
    //   userId: "test",
    // });
    // if (res && res.status) {
    //   // 第一次填入配件
    //   const setD = JSON.parse(JSON.stringify(allSystem.kit));
    //   res.data.forEach((item: Kit) => {
    //     for (let index = 0; index < setD.length; index++) {
    //       if (setD[index].K_type === item.K_type) {
    //         setD.splice(index, 1, item);
    //         break;
    //       }
    //     }
    //   });
    //   setDataSource(setD);
    // }
  } else {
    // 先清零一次
    allSystem.attribute.forEach((item: AttriKeyValue) => (item.value = 0));
    // 这里计算角色属性
    const attriSpecial = allSystem.attribute;
    const attribute = attriSpecial.splice(-4, 4);
    allSystem.kit.forEach((element: Kit) => {
      if (element.UserId === undefined) return null;
      Object.keys(element).forEach((item: string, index: number) => {
        if (item === "K_sAttrType") {
          const resA = attriSpecial.find(
            (att: AttriKeyValue) => att.key === Object.values(element)[index]
          );
          if (resA && element.K_sAttrValue) resA.value += element.K_sAttrValue;
          return null;
        }
        const res = attribute.find(
          (att: AttriKeyValue) => att.keyName === getKitAttrType(item)
        );
        if (res) res.value += Object.values(element)[index];
      });
    });
    attriSpecial.forEach(
      (item: AttriKeyValue) => (item.value = Math.round(item.value * 100) / 100)
    );
    setAttribute(attriSpecial.concat(attribute));
  }
  setShade(false);
};
// 随机概率是否命中计算
const getOddsRezult = (odds: number) => Math.random() * 10000 < odds * 100;
// 模拟11级配件品质随机几率
const getOdds = () => [30, 48, 14.7, 5.9, 1.22, 0.16, 0.02];
// const getOdds = () => [10, 8, 14.7, 5.9, 1.22, 0.16, 60.02];
// 攻击 lv*25*quality
// 生命 lv*50*quality
// 速度 lv*5*quality
// 防御 lv*10*quality
// 随机获得一个装备封包
const getKit = (U_lv: number) => {
  let quality: number = 0,
    lv: number = U_lv;
  // 计算品质
  // 拿到本次10000 ~ 0 区间内撞击到的数字
  const random = Math.floor(Math.random() * 10001);
  // const random = 9800;
  const oddsArry = getOdds();
  // 递归计算中位区间最小值与最大值
  const sum = (index: number, num: number) => {
    const sumItem: number =
      index < 0 ? num : sum(index - 1, (num += oddsArry[index]));
    return sumItem;
  };
  // 这里循环拿概率组去对，看看拿到的随机数字撞中了哪个区间
  for (let index = 0; index < oddsArry.length; index++) {
    if (
      (!index && random < oddsArry[index] * 100) ||
      (index === oddsArry.length - 1 &&
        random > 10000 - oddsArry[index] * 100) ||
      (random < sum(index, 0) * 100 && random >= sum(index - 1, 0) * 100)
    ) {
      quality = index;
      break;
    }
  }
  // 计算浮动等级 ↑2 ↓2
  if (getOddsRezult(50)) {
    lv += Number(getOddsRezult(50)) + Number(getOddsRezult(30));
  } else {
    lv -= 1 + Number(getOddsRezult(50));
  }
  if (lv <= 0) lv = 1;
  // 返回配件
  const kit: Kit = {
    K_attack: lv * 25 * (quality + 2) * 0.2,
    K_hp: lv * 50 * (quality + 2) * 0.2,
    K_speed: lv * 5 * (quality + 2) * 0.2,
    K_defense: lv * 10 * (quality + 2) * 0.2,
    K_type: Math.floor(Math.random() * 11),
    K_lv: lv,
    K_quality: quality,
    UserId: "test",
    K_sAttrType: quality > 1 ? Math.floor(Math.random() * 6) : 9999,
    // K_sAttrType: 4,
    K_sAttrValue: getKitAttrValue(quality),
  };
  return kit;
};
// 这里获得activity模块的固定参数
const getActivity = () => {
  const activity: Activity = {
    left: [
      { name: "冒险", key: "risk" },
      { name: "爬塔", key: "tower" },
      { name: "野外", key: "field" },
    ],
    right: [
      { name: "钓鱼", key: "fish" },
      { name: "竞技", key: "figth" },
      { name: "领地", key: "home" },
    ],
  };
  return activity;
};
export default {
  getKitName,
  getKitQuality,
  getKitAttrType,
  getOddsRezult,
  getInitUser,
  getInitKitDataSource,
  getInitAttribute,
  reset,
  getKit,
  getOdds,
  getSection,
  getActivity,
};
