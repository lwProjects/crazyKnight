import { useEffect, useState } from "react";
import "./style.css";
import petFun from "../../config/petFun";
import { message } from "antd";

export default (props: { setVisible: Function }) => {
  const [pets, setPets] = useState<Pets[]>(petFun.initPetBox());
  const getPets = () => {
    const nPetS: Pets[] = JSON.parse(JSON.stringify(pets));
    if (
      nPetS.filter((item: Pets) => item.P_petId != undefined).length ===
      nPetS.length
    ) {
      message.error("宠物栏已满");
      return;
    }

    for (let i = 0; i < nPetS.length; i++) {
      if (nPetS[i].P_petId === undefined) {
        nPetS[i].P_quality = 3;
        nPetS[i].P_petId = petFun.getPetQ_C();
        nPetS[i].P_lv = 1;
        nPetS[i].P_ee = 0;
        break;
      }
    }
    setPets(nPetS);
  };
  useEffect(() => {
    const hasPets = document.getElementsByClassName("hasPet");
    for (let i = 0; i < hasPets.length; i++) {
      const element = hasPets[i] as HTMLElement;
      element.ontouchstart = null;
      element.ontouchmove = null;
      element.ontouchend = null;
      petFun.drag(element, pets, setPets);
    }
  }, [pets]);
  return (
    <div className="petBox">
      <div className="scaleBox">
        {/* 占位栏 图鉴栏 */}
        <div className="petTop">
          <div className="pets"></div>
          <div className="handles"></div>
          <div className="handles"></div>
        </div>
        {/* 主体区域 */}
        <div className="petBody">
          {pets.map((item: Pets) => (
            <div className="pets" key={item.key} data-key={item.key}>
              {item.P_petId !== undefined && (
                <div
                  data-key={item.key}
                  className="hasPet"
                  style={{
                    background: petFun.getPetQuality(item.P_quality || 99).bg,
                  }}
                >
                  {`${petFun.getPetQuality(item.P_quality || 99).name}:${
                    petFun.getPetName(item.P_petId)?.P_name
                  }`}
                  <span className="lv" data-key={item.key}>
                    lv.{item.P_lv}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="getPetsBox">
          <div className="getPets" onClick={() => getPets()}>
            买蛋
          </div>
        </div>
        <div className="close" onClick={() => props.setVisible(false)}>
          关闭
        </div>
      </div>
    </div>
  );
};
