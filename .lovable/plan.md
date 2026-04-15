# 首次进入沉浸式视频引导交互方案

## 概述

用户首次进入页面时播放引导视频，营造从视频中扑克牌变为模板卡片的沉浸式过渡体验。整个流程分为4个阶段：视频1播放 → 视频2循环 → 卡片飞出动画 → 正常使用状态。

## 交互流程

```text
阶段1: 视频1播放（首次进入视频.mp4）
  - 全屏背景视频，仅显示标题+副标题（居中）
  - 无输入框、无卡片、无侧边栏交互
  - 视频播放结束后自动进入阶段2

阶段2: 视频2播放（2.mp4）
  - 无缝切换为第二个视频，循环播放
  - 仍然只显示标题+副标题

阶段3: 卡片飞出动画（视频2首次播完时触发）
  - 标题淡出
  - 4张卡片从视频画面中心偏上（模拟扑克牌位置）缩小状态飞出
  - 动画：先从中心偏上小尺寸出现，然后放大+位移到扇形展开位置
  - 动画时长约 1-1.5s，带 spring 弹性效果
  - 视频2在背景继续循环播放

阶段4: 正常使用状态
  - 卡片就位，可交互（hover 显示 Try this）
  - 点击 Try this → 顶部 CreationPanel 动画滑入出现
  - 视频2作为背景持续循环
```

## 技术实现

### 1. 复制视频文件到 `public/`

- `首次进入视频.mp4` → `public/videos/intro.mp4`
- `2.mp4` → `public/videos/loop.mp4`

### 2. 新增状态管理 — `src/pages/Index.tsx`

```typescript
// 页面阶段
type Phase = "intro" | "loop" | "cards-fly" | "ready";

const [phase, setPhase] = useState<Phase>("intro");
const [showPanel, setShowPanel] = useState(false); // 输入框是否显示
```

- `intro`: 视频1播放中
- `loop`: 视频2开始播放
- `cards-fly`: 视频2首次播完，卡片飞出动画进行中
- `ready`: 卡片就位，正常交互

### 3. 视频背景层 — `src/pages/Index.tsx`

- 使用两个 `<video>` 元素，通过 opacity 切换
- 视频1: `onEnded` → 设置 phase 为 `"loop"`
- 视频2: 监听 `onEnded` 事件，首次触发时设置 phase 为 `"cards-fly"`，之后继续循环（`video.play()`）
- 视频铺满整个内容区域，`object-fit: cover`

### 4. 标题显示逻辑 — `HeroSection`

- `phase === "intro" || phase === "loop"` 时居中显示标题+副标题
- `phase === "cards-fly"` 时标题淡出（CSS transition opacity）
- `phase === "ready"` 时标题隐藏或缩小到顶部

### 5. 卡片飞出动画 — `src/pages/Index.tsx`

当 `phase === "cards-fly"` 时：

- 4张卡片初始状态：`scale(0.3) translate(中心位置)`，opacity 0
- 依次延迟（每张间隔 100-150ms）通过 CSS transition 飞到扇形展开的最终位置
- 动画完成后（约 1.2s）设置 phase 为 `"ready"`
- 使用 `transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)` 实现弹性飞出效果

### 6. CreationPanel 显示逻辑

- 默认隐藏 (`showPanel = false`)
- 点击任意卡片的 "Try this" → `setShowPanel(true)` + 填入 prompt
- CreationPanel 从顶部滑入（`transform: translateY(-100%)` → `translateY(0)`，transition 0.4s）

### 7. 刷新重播

- 不使用 localStorage 持久化状态，每次刷新 phase 重置为 `"intro"`，自然重新播放整个流程

## 需要修改的文件


| 文件                                | 改动                                             |
| --------------------------------- | ---------------------------------------------- |
| `public/videos/`                  | 新增两个视频文件                                       |
| `src/pages/Index.tsx`             | 添加 phase 状态机、视频背景层、卡片飞出动画逻辑、CreationPanel 条件显示 |
| `src/components/HeroSection.tsx`  | 接收 phase prop，控制显示/淡出                          |
| `src/components/TemplateCard.tsx` | onTry 回调不变，由父组件控制 showPanel                    |
