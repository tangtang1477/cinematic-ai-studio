

# 4 项修改计划

## 1. 替换视频2 — `public/videos/loop.mp4`
用上传的 `1_3.mp4` 替换当前 `loop.mp4`，如文件过大则用 ffmpeg 压缩到 2Mbps 左右。

## 2. 卡片蒙层修复 — `src/components/TemplateCard.tsx`
当前问题：默认态文字下方空白过多（给 hover 按钮预留了空间），文字只显示 2 行。

改法：
- 文字从 `line-clamp-2` 改为 `line-clamp-3`，显示三行描述
- 默认态文字紧贴卡片底部，`py-2 px-3`，不预留按钮空间
- hover 时文字淡出、按钮淡入，使用 `position: absolute` 让按钮覆盖在同一位置，不撑高容器
- 保留现有的模糊蒙层（`backdrop-filter: blur(12px)` + 渐变 mask），不做修改
- 蒙层高度从 `80px` 调大到 `90px` 以匹配三行文字

## 3. 卡片飞入动画优化 — `src/pages/Index.tsx`
当前问题：卡片从 `-30vh` 位置出现，视觉上不够"从视频上方飞入画面中心"，动效不够丝滑。

改法：
- 初始位置改为 `translate3d(0, -50vh, 0) scale(0.1)`，从更高处（视频扑克牌区域）出发
- 去掉 `rotateX(25deg)`，简化为纯 `translate + scale + opacity + blur` 组合
- 落位动画曲线统一为 `cubic-bezier(0.22, 1, 0.36, 1)`，时长 1s
- 错峰延迟保持每张 100ms
- 确保 `requestAnimationFrame` 双帧触发 `landed` 状态，实现从无到有的丝滑过渡

## 4. 页面间距调整 — `src/pages/Index.tsx`
输入框出现后的布局：
- CreationPanel 距顶部 `64px`（已有）
- CreationPanel 与主标题间距：`64px`（当前是 `32px`，需改）
- 主标题与卡片间距：`64px`（已有）

改法：
- `marginTop: showPanel ? "32px" : "0"` 改为 `marginTop: showPanel ? "64px" : "0"`

## 涉及文件

| 文件 | 改动 |
|------|------|
| `public/videos/loop.mp4` | 替换为新视频 |
| `src/components/TemplateCard.tsx` | 文字三行、紧贴底部、不预留按钮空间、蒙层高度微调 |
| `src/pages/Index.tsx` | 飞入起点更高、动画更丝滑、间距 64px |

