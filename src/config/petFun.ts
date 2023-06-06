import { LoginOutlined } from "@ant-design/icons";
import { message } from "antd";
import "./interfaceGloble";
import kitFun from "./kitFun";

// 宠物表
const pets: PetsFind[] = [
  {
    P_petId: 0,
    P_name: "小火苗",
  },
  {
    P_petId: 9999,
    P_name: "史莱姆",
  },
];
// 拿宠物名字
const getPetName = (petId: number) =>
  pets.find((item: PetsFind) => item.P_petId === petId);
// 品质: 白d->蓝色c->紫色b->金色a->橙色s->红色ss->蓝色sss
const getPetQuality = (quality: number) => {
  switch (quality) {
    case 0:
      return { name: "D级", bg: "rgb(255, 255, 240)" };
    case 1:
      return { name: "C级", bg: "rgb(194, 233, 200)" };
    case 2:
      return { name: "B级", bg: "rgb(162, 31, 147)" };
    case 3:
      return { name: "A级", bg: "rgb(234, 228, 139)" };
    case 4:
      return { name: "S级", bg: "rgb(254, 221, 7)" };
    case 5:
      return { name: "Ss级", bg: "rgb(237, 93, 67)" };
    case 6:
      return { name: "Sss级", bg: "rgb(47, 187, 214)" };
    default:
      return { name: "", bg: "" };
  }
};
// 升级经验表
const lvEe = (() => {
  const arr: number[] = [0];
  for (let i = 1; i < 100; i++) {
    arr.push(Math.floor(i / 10) * 1000 + (i % 10) * 20);
  }
  return arr;
})();
// 升阶概率
const getLvs = (() => [0.9, 0.65, 0.33, 0.16, 0.08, 0.03])();
// 递归出来总经验值
const eeDg = (lv: number, ee: number) => {
  if (lv !== 1) ee += eeDg(lv - 1, lvEe[lv - 1]);
  return ee;
};
// 递归出来升级的等级
const moveUpDg = (movePet: PetsLv, ee: number) => {
  ee += movePet.P_ee;
  movePet.P_ee = 0;
  if (ee - lvEe[movePet.P_lv] >= 0) {
    ee -= lvEe[movePet.P_lv];
    movePet.P_lv += 1;
    movePet = moveUpDg(movePet, ee);
    return movePet;
  }
  movePet.P_ee = ee;
  return movePet;
  // endPet.
};
// 初始化16格位置
const initPetBox = () => {
  const nPets: Pets[] = [];
  for (let index = 0; index < 16; index++) {
    nPets.push({ key: index });
  }
  return nPets;
};
// 随机开一个C级蓝色的蛋拿到编码
const getPetQ_C = () =>
  pets.find((item: PetsFind) => item.P_petId === 0)?.P_petId || 0;
// 封装触屏移动事件
const drag = (el: HTMLElement, data: Pets[], setData: Function) => {
  const startXy = {
    x: 0,
    y: 0,
  };
  // el.addEventListener("touchstart", handleStart);
  // el.addEventListener("touchmove", handleMove);
  // el.addEventListener("touchend", handleEnd);

  el.ontouchstart = handleStart;
  el.ontouchmove = handleMove;
  el.ontouchend = handleEnd;
  function handleStart(e: TouchEvent) {
    if (e.target instanceof HTMLElement) {
      let el = e.target;
      if (
        e.target.className === "lv" &&
        e.target.parentNode &&
        e.target.parentNode instanceof HTMLElement
      )
        el = e.target.parentNode;
      el.style.zIndex = "9999";
      startXy.x = e.changedTouches[0].pageX;
      startXy.y = e.changedTouches[0].pageY;
    }
  }
  function handleMove(e: TouchEvent) {
    if (e.target instanceof HTMLElement) {
      e.preventDefault();
      let el = e.target;
      if (
        e.target.className === "lv" &&
        e.target.parentNode &&
        e.target.parentNode instanceof HTMLElement
      )
        el = e.target.parentNode;
      el.style.transform = `translate3d(${
        e.changedTouches[0].pageX - startXy.x + "px"
      },${e.changedTouches[0].pageY - startXy.y + "px"},0)`;
    }
  }
  function handleEnd(e: TouchEvent) {
    if (e.target instanceof HTMLElement && e.target.dataset.key) {
      let el: HTMLElement = e.target;
      let pNode = 1;
      if (
        e.target.className === "lv" &&
        e.target.parentNode &&
        e.target.parentNode instanceof HTMLElement
      ) {
        pNode = 2;
        el = e.target.parentNode;
      }
      const elsElement = document.elementsFromPoint(
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      );
      const els: HTMLElement[] = [];
      for (const item of elsElement) {
        if (item instanceof HTMLElement) {
          els.push(item);
        }
      }
      if (els.length > 3) {
        switch (els[pNode].className) {
          case "pets":
            console.log(`12`);
            if (els[pNode].dataset.key !== e.target.dataset.key) {
              const nData: Pets[] = JSON.parse(JSON.stringify(data));
              const oldPet = data[parseInt(e.target.dataset.key)];
              nData[parseInt(els[pNode].dataset.key || "0")] = {
                ...oldPet,
                ...nData[parseInt(els[pNode].dataset.key || "0")],
              };
              nData[parseInt(e.target.dataset.key)] = {
                key: nData[parseInt(e.target.dataset.key)].key,
              };
              setData(nData);
            }
            break;
          case "hasPet":
            const nData: Pets[] = JSON.parse(JSON.stringify(data));
            const nPet: Pets = nData[parseInt(els[pNode].dataset.key || "0")];
            const oldPet: Pets = nData[parseInt(e.target.dataset.key)];
            //  00 + 00 对冲
            if (oldPet.P_petId !== 9999 && nPet.P_petId !== 9999) {
              if (oldPet.P_quality !== nPet.P_quality) {
                message.error("00 品质不同,无法hc");
              } else if (nPet.P_quality) {
                const res = kitFun.getOddsRezult(getLvs[nPet.P_quality] * 100);
                const setOver: PetsLv = moveUpDg(
                  { P_lv: nPet.P_lv || 1, P_ee: nPet.P_ee || 0 },
                  eeDg(oldPet.P_lv || 1, oldPet.P_ee || 0)
                );
                nPet.P_lv = setOver.P_lv;
                nPet.P_ee = setOver.P_ee;
                if (res) {
                  nPet.P_quality += 1;
                } else {
                  nPet.P_petId = 9999;
                }
                nData[parseInt(e.target.dataset.key)] = { key: oldPet.key };
                setData(nData);
              }
              break;
            }
            //  00 + 99 对冲
            if (oldPet.P_petId !== 9999 && nPet.P_petId === 9999) {
              message.error("00 无法被 99 吞噬");
              break;
            }
            //  99 + 99 对冲 99 + 00 对冲
            if (
              (oldPet.P_petId === 9999 && nPet.P_petId === 9999) ||
              (oldPet.P_petId === 9999 && nPet.P_petId !== 9999)
            ) {
              const setOver: PetsLv = moveUpDg(
                { P_lv: nPet.P_lv || 1, P_ee: nPet.P_ee || 0 },
                eeDg(
                  oldPet.P_lv || 1,
                  (oldPet.P_quality || 0 + 1) * 200 + (oldPet.P_ee || 0)
                )
              );
              nPet.P_lv = setOver.P_lv;
              nPet.P_ee = setOver.P_ee;
              nData[parseInt(e.target.dataset.key)] = { key: oldPet.key };
              setData(nData);
              break;
            }
            break;
          default:
            break;
        }
      }

      el.style.zIndex = "";
      el.style.transform = "";
    }
  }
};

export default {
  getPetQuality,
  getPetName,
  initPetBox,
  getPetQ_C,
  drag,
};
