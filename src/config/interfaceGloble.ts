// 用户信息实体
interface User {
  UserId?: string; // 用户编号
  U_lv: number; // 用户等级
  U_lesson: number; // 用户当前经验值
  U_boxCount: number; // 用户当前拥有的kit宝箱数量
}

// 当前公共杂项实体
interface Users {
  user: User; // 用户信息实体
  setUser: Function; // set方法
  resize: Function; // 适配函数
}

// 配件属性实体 -- 在kitFun中有对应具体的swatch方法
interface Kit {
  UserId?: string; // 用户编号
  K_type: number; // 装备类型,0武器,1铠甲~~省略
  K_speed?: number; // 速度值
  K_sAttrValue?: number; // 特殊属性的值
  K_sAttrType?: number; // 特殊属性类型,0击晕,1暴击~~省略
  K_quality: number; // 装备品质等级
  K_hp?: number; // 生命值
  K_defense?: number; // 防御值
  K_attack?: number; // 攻击值
  K_lv?: number; // 装备等级
}

// interface Attribute {
//   Speed: number;
//   Hp: number;
//   Defense: number;
//   Attack: number;
// }

// interface SpecialAttribute {
//   Stun: AttriKeyValue;
//   GoOn: AttriKeyValue;
//   BeatBack: AttriKeyValue;
//   DoubleHit: AttriKeyValue;
//   Dodge: AttriKeyValue;
//   Vampire: AttriKeyValue;
// }

// 属性计算实体
interface AttriKeyValue {
  key: number; // Kit.K_sAttrType 注释如kit
  keyName: string; // Kit.K_sAttrType名
  value: number; // Kit.K_sAttrValue 注释如kit
}

// 体系集合实体 用于计算函数调用时统一传递
interface System {
  kit: Kit[]; // 当前身上穿的配件
  attribute: AttriKeyValue[]; // 当前属性值拆板，待重计算
}

// 开箱界面props对象值合集实体
interface OpenBox {
  dataSource: Kit[]; // 主界面身上的配件合集
  setDataSource: Function; // 主界面的配件合集配件set事件
  visibility: boolean; // 控显-这里不用display:node
  setVisibility: Function; // 控显 ↑ 配套set事件
  openAfter: boolean; // 主页面状态:是否开完了箱子
  setOpenAfter: Function; // 主页面状态 ↑ 配套set事件
}

// 活动模块左右合集实体
interface Activity {
  left: KeyValue[]; // 左 冒险+爬塔+野外首领 //本次 KeyValue : key:class类名,做事件委托的表示
  right: KeyValue[]; // 右 钓鱼场+竞技场+领地
}

// 键值公用实体 - 会附加
interface KeyValue {
  name: string;
  key: string;
  bgValue?: string;
}

// 公共控显实体
interface Visible {
  visible: boolean;
  setVisible: Function;
}

// 造成伤害的实体类
interface Fight {
  hurt: number; // 伤害值 0:闪避
  vertigo: boolean; // 是否击晕
  double: boolean; // 是否暴击
  beatBack: boolean; // 是否被反击
  sucking: number; // 吸血量
  beatBackV: number; // 反击量
  beatBack_D: boolean; // 反击是否触发暴击
  beatBack_V: boolean; // 反击是否触发眩晕
}

// 宠物块实体
interface Pets {
  key: number; // 所占位置
  P_petId?: number; // 宠物编号
  P_quality?: number; // 宠物品质
  P_lv?: number; // 宠物等级
  P_ee?: number; // 当前经验
}

// 升级计算
interface PetsLv {
  P_lv: number; // 宠物等级
  P_ee: number; // 当前经验
}

// 宠物图鉴实体
interface PetsFind {
  P_petId: number; // 宠物编号
  P_name: string; // 宠物名字
}
