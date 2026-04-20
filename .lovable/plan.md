
## 诊断（无痕实测 + 代码分析）

### 问题1：看不到飞入和翻转（核心bug）

session replay 显示动画**确实在跑**（连续 transform 更新 + 火花粒子生成），但你视觉上"看不到"。三个根本原因：

**A. 3D 上下文被破坏 → 翻转看不到背面**
`card-front` 上加了 `transform: rotate(${l.rotate}deg)`（2D rotate），这会**强制 flatten** 父级的 `preserve-3d`，导致 `backface-visibility: hidden` 行为异常。同时 Framer Motion 在外层 wrapper 上把 `x/y/scale` 合成成一个 matrix transform，与 `transformStyle: preserve-3d` 配合时会把 3D 子节点也压平，rotateY 看起来像左右拉伸而不是真正翻转。

**B. 触发时机太早，用户看不到第一帧**
`loopActuallyPlaying` 在 loop 视频 `playing` 事件触发瞬间就 setState，而那一刻视频可能还在和 intro crossfade（500ms transition），用户的视线焦点还在 intro。1.4s 后回头看，动画已结束。

**C. 起点 X 计算错误**
`startX = viewportCenterX + START_X_OFFSETS[i] - CARD_WIDTH/2`
但 `viewportCenterX = SIDEBAR_WIDTH + contentWidth/2`。问题：起点 Y=110 是从视口顶部算的，但 5 张卡片的 startX 实际散布在 `[centerX-280, centerX+60]` 范围内（CARD_WIDTH=220），离"输入框上方一排"的视觉印象有偏差。其实输入框宽度 ~700px，`±160px` 偏移已经接近输入框边缘，看起来正常 —— **但因为 A+B 看不到任何过程，等于没飞**。

### 问题2：卡片图片加载卡顿

虽然 `preloadTemplateImages()` 用 `img.decode()` 并 await，但：
- `TemplateCard` 里 `<img decoding="sync" loading="eager">` —— **sync decoding 会阻塞主线程**，正好在卡片落定瞬间触发，造成 60-200ms 卡顿
- 5 张图同时首次进入合成层（GPU 上传纹理），在背面翻到正面那一刻才被浏览器认为"需要可见"，触发 GPU upload spike

## 改动方案

### 1. `src/components/FlyingCardsScene.tsx` — 修真 3D + 真位移

**结构调整**（新增一层 transform 隔离）：
```
card-wrapper (motion)         ← x, y, opacity, filter（纯 2D 位移）
  card-3d-stage               ← perspective: 1200px（每张卡独立 perspective）
    card-inner (motion)       ← rotateY + scale（真 3D）
      card-front              ← NO 2D rotate；rotate 移到 wrapper 上
      card-back               ← rotateY(180deg)
```

关键改动：
- **把 `rotate(${l.rotate}deg)` 从 card-front 移除**，放到外层 wrapper 的 `rotate` motion prop（与 x/y/scale 一起，Framer Motion 会合并成一个 2D 矩阵，不影响内层 3D）
- **每张卡自己一层 perspective**（`perspective: 1200px` on `card-3d-stage`），而不是共享 scene 的 perspective —— 避免不同位置卡片透视差异导致翻转视觉怪异
- **scale 放到 inner**（和 rotateY 一起），不再放到 wrapper，避免 scale 干扰 3D 矩阵
- **wrapper 仅做 `x/y/opacity/filter/rotate(2D)`**，纯平面变换
- 起点 scale 改为 `0.3`（更明显"从无到有"）
- duration 提高到 `1.6s`，FLIP_HOLD `0.45s`（背面停留更明显）
- stagger 保持 `0.06s`

### 2. `src/components/TemplateCard.tsx` — 修图片卡顿

- 改 `decoding="sync"` → `decoding="async"`
- 不变 `loading="eager"`

### 3. `src/pages/Index.tsx` — 修触发时机

- 飞入触发前，**额外延迟 250ms**（确保 loop 视频已经 fade-in 完成、用户视线已经稳定在画面上才开始飞）
- 或更稳妥：触发条件改为 `loopActuallyPlaying && imagesReady && loopVideo.currentTime > 0.3`（loop 真正进入稳定播放）—— 用 250ms `setTimeout` 实现即可
- 飞入开始的瞬间额外打一个 console.log 让你能在 devtools 验证

### 4. 火花粒子修复
当前 `setSparkles` 用 `Date.now()+i` 作为 id，700ms 后再用 `Date.now()+i` 过滤，但 700ms 后 `Date.now()` 已变 → 永远过滤不掉，sparkles 数组无限增长。改用 `useRef counter` 生成稳定 id。

### 5. 不动
视频加载逻辑、CardBack、CreationPanel、HeroSection、扇形落定布局

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/components/FlyingCardsScene.tsx` | 重构 3D 结构（per-card perspective、scale 移到 inner、final rotate 移到 wrapper），延长 duration/FLIP_HOLD，修 sparkle id 泄漏 |
| `src/components/TemplateCard.tsx` | `decoding="sync"` → `async` |
| `src/pages/Index.tsx` | 飞入触发额外 +250ms 延迟，确保用户能看到第一帧 |

## 验收（无痕浏览器）

1. 视频2 fade-in 完成后，**明显看到** 5 张卡片从输入框上方一排同时出现（小、半透、blur、背面朝前）
2. 前 0.45s 清晰可见蓝色扑克牌背面
3. 中段 5 张同步飞向扇形位置，边飞边翻边放大，**真实 3D 透视感**（翻转过程中能看到 rotateY 的"立体感"，不是左右拉伸）
4. 落定瞬间无图片加载卡顿，火花粒子辐射后扇形稳定
