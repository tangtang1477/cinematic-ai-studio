
## 分析

代码里飞入逻辑是有的，但你反复看不到——核心原因是当前用 CSS keyframe + `onAnimationEnd` 监听 `animationName === "cardFlight"` 触发落定，这套方案在以下情况下会"看起来像直接出现"：

1. **动画在你看到之前就完成了**：`loopActuallyPlaying && imagesReady` 的 gate 是页面初始化阶段触发的，等你回头看，动画已经跑完，5 张卡早就 settled，看到的就是静止扇形。
2. **CSS keyframe 在某些渲染时机会被浏览器跳过 0% 状态**（即使有 `animation-fill-mode: both`，在初次 mount + 同帧 set state 的极端情况下会出现"flash to final"）。
3. **没有视觉反馈**没拖尾、没光晕、没火花，1.4s 极快的翻转 + 飞入很容易被你当成"瞬间出现"。

要彻底解决，必须换一套**可靠、可视、可重放**的方案。

## 改动方案（用 Framer Motion 重做）

### 1. 引入 Framer Motion（项目已有 React，可直接装）

`framer-motion` 比手写 keyframe 可靠得多，状态机明确，不会出现"跳过初始帧"问题。

### 2. 新建 `src/components/FlyingCardsScene.tsx`

完整组件，包含 5 张卡片的飞入 + 翻转 + 拖尾 + 落地火花。

**结构（严格按你要求的 cards-scene 层级）**：
```
<motion.div className="cards-scene">  {perspective: 1400px}
  {templates.map((t, i) => (
    <motion.div className="card-wrapper"            // 控制位移、缩放、透明度、blur
      initial={{ x: startX[i], y: startY, scale: 0.4, opacity: 0, filter: "blur(6px)" }}
      animate={{ x: endX[i],   y: endY,   scale: 1,   opacity: 1, filter: "blur(0)" }}
      transition={{
        duration: 1.4,
        delay: i * 0.06,       // 60ms stagger
        ease: [0.22, 1, 0.36, 1],   // 高级 ease-out
      }}
      onAnimationComplete={() => triggerSparkle(i)}
    >
      <motion.div className="card-inner"            // 控制 3D 翻转
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 0 }}
        transition={{
          duration: 1.4,
          delay: i * 0.06 + 0.35,   // 关键：背面停留 0.35s 再翻
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="card-front" style={{ backfaceVisibility: "hidden" }}>
          <TemplateCard ... noOverlay />
        </div>
        <div className="card-back" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <CardBack />
        </div>
      </motion.div>

      {/* 拖尾光晕 — 跟随卡片，淡出 */}
      <motion.div className="glow-trail"
        initial={{ opacity: 0.8, scale: 0.4 }}
        animate={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 1.4, delay: i * 0.06, ease: "easeOut" }}
        style={{
          position: "absolute", inset: -30,
          background: "radial-gradient(circle, rgba(113,240,246,0.55) 0%, rgba(113,240,246,0) 70%)",
          filter: "blur(12px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </motion.div>
  ))}

  {/* 落地火花 — 每张卡 onAnimationComplete 时在终点位置放 6-8 个粒子 */}
  <Sparkles ... />
</motion.div>
```

**关键参数**：
- 起始 `x`：`-160, -80, 0, 80, 160`（同 Y、不同 X，从输入框顶部水平排开）
- 起始 `y`：输入框顶部 = `~110px`
- 终点 `x/y`：根据 `CARD_FINAL_TRANSFORMS` + 视口居中计算
- 总时长：1.4s
- stagger：60ms
- 翻转 delay：350ms（让背面在前 25% 时间内清晰可见，无任何"一闪而过"风险）
- ease：`cubic-bezier(0.22, 1, 0.36, 1)`（apple-like ease-out）
- `perspective`：1400px（更柔和的透视）
- 中间卡片 `zIndex: 20`，邻居 10，外侧 5

### 3. 拖尾光晕（cyan glow trail）

每张卡片 wrapper 内部放一个 `radial-gradient` 圆形光晕，初始 opacity 0.8、scale 0.4，1.4s 内同步扩散到 scale 1.2、opacity 0，配合卡片移动产生"拖尾"视觉。

### 4. 落地火花（sparkle particles）

新建子组件 `<LandingSparkle x y delay />`：在卡片 `onAnimationComplete` 时挂载，绘制 8 个小粒子（white + cyan 混合），用 framer-motion `animate` 从中心向外辐射，每个粒子 random 角度 + 60-90px 距离，duration 0.5s opacity 1→0，scale 0.5→0。卸载时移除。

### 5. `src/pages/Index.tsx` 改动

- 删除现有的 fly layer JSX（lines 308-379）
- 删除 `handleCardFlyEnd` 和 `flyEndCount`
- 替换为：
  ```tsx
  {cardsVisible && !cardsSettled && imagesReady && (
    <FlyingCardsScene
      templates={templates}
      onAllSettled={() => { setCardsSettled(true); setPhase("ready"); }}
    />
  )}
  ```
- 触发 gate 不变（`loopActuallyPlaying && imagesReady`）

### 6. `src/index.css`

- 删除 `cardFlight` 和 `cardFlip` keyframe（不再需要）
- 保留其他动画

### 7. 不动

- 视频加载逻辑、imagesReady 门控、视频元素
- CreationPanel、TemplateCard、CardBack、AppSidebar、HeroSection
- 落定后的扇形展示 (`CARD_FINAL_TRANSFORMS`)
- 玻璃材质、颜色、布局

## 涉及文件

| 文件 | 改动 |
|---|---|
| `package.json` | 加 `framer-motion` 依赖 |
| `src/components/FlyingCardsScene.tsx` | 新建：5 张双面卡片 + 拖尾 + 火花的完整动效 |
| `src/components/LandingSparkle.tsx` | 新建：单个落地火花粒子组件 |
| `src/pages/Index.tsx` | 替换 fly layer 为 `<FlyingCardsScene>` |
| `src/index.css` | 删除旧 `cardFlight` / `cardFlip` keyframe |

## 验收（无痕浏览器）

1. 视频2开播后，5 张卡片**清晰可见地**从输入框顶部同一水平线、5 个不同 X 同时弹出（带 60ms 微 stagger）
2. 卡片伴随 cyan 拖尾光晕飞向目标，前 0.35s 明显看到蓝色扑克牌背面
3. 中段同步：边飞、边翻、边放大，3D 透视感强
4. 落定瞬间每张卡触发火花粒子辐射效果
5. 最终 5 张正面朝前，扇形排布，干净稳定
