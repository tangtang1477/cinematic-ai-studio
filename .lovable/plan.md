
## 分析

当前实现结构上其实已经满足你的核心需求（5 张双面卡片、同 Y 不同 X 起点、3D 翻转、飞入落位），但你说"动效没做出来"——根本原因是参数配置导致**视觉上看不出来**：

### 现状问题
1. **背面看不清**：`cardFlip` keyframe 0% 起始 `rotateY(180deg) scale(0.4)`，但 30% 才到 `scale(0.55)` 还是 180°，仅仅从 0.4 → 0.55 放大幅度太小，配合 `cardFlight` 的 0% blur(6px)，背面阶段几乎是个模糊小点，看不清是扑克牌。
2. **翻转太快被位移盖过**：70% 才开始翻转（180° → 40°），但卡片那时已经飞到接近终点，注意力都在落位上，翻转过程被"吃掉"。
3. **起始 scale 太大**：0.4 不够小，"从无到有、从远处生成"的感觉弱。
4. **位移路径平直**：纯 `translate3d` 直线飞入，缺少高级感（轻微弧线/Z轴会更立体）。
5. **stagger 70ms 偏大**：5 张总延迟 280ms，破坏"一组同时飞入"的统一感。

### 你期望的视觉节奏
- 0~35%：背面清晰可见，scale 从极小快速放大到中等，blur 快速消失 → 让"扑克牌背面"这个信息送达
- 35~75%：边飞边翻边继续放大，3D 透视感强
- 75~100%：正面朝前 + 轻微 overshoot 落位

## 改动方案

### 1. `src/index.css` — 重写两个 keyframe 让动效真正"看得见"

**`cardFlip`**（核心修改）
```
0%   { transform: rotateY(180deg) scale(0.35); }
20%  { transform: rotateY(180deg) scale(0.7);  }  /* 背面快速放大到清晰可辨 */
35%  { transform: rotateY(180deg) scale(0.85); }  /* 背面继续保持，给眼睛时间识别 */
75%  { transform: rotateY(20deg)  scale(1.0);  }  /* 翻转主体在 35%~75% 完成 */
90%  { transform: rotateY(0deg)   scale(1.05); }  /* 轻微 overshoot */
100% { transform: rotateY(0deg)   scale(1);    }
```

**`cardFlight`**（位移 + 透明度 + blur）
```
0%   { transform: translate3d(0,0,0); opacity: 0; filter: blur(8px); }
8%   { opacity: 1; filter: blur(3px); }            /* 快速可见，配合背面放大 */
30%  { filter: blur(0); }                          /* blur 在背面阶段就消失，看清扑克牌 */
85%  { transform: translate3d(calc(var(--fly-dx)*1.02), calc(var(--fly-dy)*1.01), 0); opacity: 1; }
100% { transform: translate3d(var(--fly-dx), var(--fly-dy), 0); opacity: 1; }
```

### 2. `src/pages/Index.tsx` — 微调时长 / stagger / 起点 scale

- 动画时长 `1.5s` → `1.4s`（更紧凑利落）
- stagger `70ms` → `50ms`（更"一组"，不松散）
- `perspective` `1400px` → `1100px`（透视感更强一些）
- 给中间卡片加更高 z-index（已有 i===1||i===2 → 10，调整为 i===2 → 20，i===1||3 → 10，更清晰的层次）
- 起始 Y 微调：`startY: 110` 保持
- 加一点轻微 X 弧线效果：飞入中段在外层 wrapper 用 `translateX` 微偏移（可选，通过 keyframe 35% 给一个 dx*0.5 的中间点，让路径不是直线）

### 3. `src/components/FlippableCard.tsx` — 不动
- 已是稳定结构（双 face + backface-hidden + back rotateY 180），无需改

### 4. 不动
- 视频逻辑、imagesReady 门控、loop 视频严格 onPlaying 才触发飞入（这部分已经对）
- 落位后的 `CARD_FINAL_TRANSFORMS` 扇形排布
- 卡片正面 / 背面图片素材
- Tab、CreationPanel、其他 UI

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/index.css` | 重写 `cardFlight` 和 `cardFlip` 两个 keyframe，让背面清晰可见、翻转占据主时段、blur 早消失 |
| `src/pages/Index.tsx` | 时长 1.4s、stagger 50ms、perspective 1100px、中间卡 z-index 突出 |

## 验收（无痕浏览器）

1. 卡片从输入框顶部同一水平线、5 个不同 X 同时弹出
2. 前 35% 时间能**清晰看到蓝色扑克牌背面**（不再是糊成一团的小点）
3. 中段同步发生：边飞、边翻、边放大，有真实 3D 透视
4. 末段轻微 overshoot 后稳稳落位成扇形，5 张正面朝前
5. 整体节奏统一（stagger 仅 50ms），像"一组卡片"而非"5 张依次"
