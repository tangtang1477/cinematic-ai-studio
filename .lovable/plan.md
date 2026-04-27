## 需求

仅针对移动端（< 768px），桌面端完全不动：
1. **卡片布局**：取消横向滚动，5 张卡片在默认视口内全部可见
2. **CreationPanel 控件行**：当前控件 wrap 成 2 行，改为图标化压缩到 1 行

## 方案

### 改动 1：移动端卡片改为等宽紧凑栅格（`src/pages/Index.tsx`）

390px 视口下，移除横向滚动，改为 5 列等宽 flex 布局：

- 容器：`flex justify-center gap-1.5 px-3` ，去掉 `overflow-x-auto`、`w-screen`
- 每张卡片宽度：`flex: 1 1 0`，`max-width: 64px`（5×64 + 4×6 间隙 = 344px，留有余量）
- 卡片自身 3:4 比例由 TemplateCard 内部 `aspectRatio: "3/4"` 保持，高度自动 ≈ 85px
- 选中态：保留 `translateY(-6px)` 和发光描边
- 桌面端逻辑（扇形 + 飞入动画）一行不动

```tsx
// 仅当 isMobile 时
<div className="flex items-end justify-center gap-1.5 px-3 w-full">
  {templates.map((t, i) => (
    <div style={{ flex: "1 1 0", maxWidth: 64, ... }}>
      <TemplateCard ... />
    </div>
  ))}
</div>
```

由于卡片很小，移动端 TemplateCard 内部需要隐藏底部描述文字，仅保留图片 + tap 后浮出 Try 按钮。在 TemplateCard 增加可选 `compact` prop（默认 false），移动端传 `compact`，描述段落隐藏，Try 按钮缩小为图标按钮。

### 改动 2：CreationPanel 控件行图标化（`src/components/CreationPanel.tsx`）

当前 5 个胶囊按钮（Model / Duration / Aspect / Voice / GenMode）+ Make 按钮，在 390px 下必然 2 行。

移动端策略（用 `useIsMobile` 检测）：
- **隐藏文字标签**，仅保留 icon + ChevronDown 小箭头
  - Model：去掉 "Seedance 2.0" 文字 → 只剩 icon（用 `Box` 或 `Layers` 图标，原本无 icon 需新增）
  - Duration：保留 `iconTime`，去掉 "1 min" 文字
  - Aspect：保留 RatioIcon，去掉 "16:9" 文字
  - Voice：保留 `Mic` icon，去掉 "Warm Female" 文字
  - GenMode：保留 `Sparkles` icon，去掉 "Director" 文字
- 按钮 padding 从 `px-3 py-1.5` → `px-2 py-1.5`，移除 `ChevronDown`（移动端）
- Make 按钮：保留图标 + 文字，但缩小为 `px-3 py-1.5`
- 容器内边距 `px-5 pb-3` → `px-3 pb-2`，gap 从 `gap-2` → `gap-1.5`
- `flex-wrap` 改为 `flex-nowrap`，确保 1 行

预估宽度：5 × 36px（icon 按钮）+ 4 × 6px gap + Make ~70px + 容器内边距 24px ≈ 298px，在 390px 视口内安全单行。

桌面端（`!isMobile`）渲染保持完整文字 + ChevronDown，不动。

### 改动 3：辅助 - 移动端去掉 Tabs 上方输入区的 placeholder 长度问题

CreationPanel 的 textarea 当前 `rows={2}`，placeholder 较长，在窄屏会换行。这部分暂不动（已能正常显示），保持现状。

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/pages/Index.tsx` | 移动端卡片容器：去掉 `overflow-x-auto`、`w-screen`、固定 160px 宽；改为 `flex justify-center gap-1.5`，每卡 `flex:1 1 0` + `max-width:64px`；传 `compact` 给 TemplateCard |
| `src/components/TemplateCard.tsx` | 新增 `compact?: boolean` prop；compact 模式隐藏描述段落，Try 按钮改为仅图标小尺寸 |
| `src/components/CreationPanel.tsx` | 引入 `useIsMobile`；移动端控件按钮去掉文字 label 与 ChevronDown，仅保留 icon；Model 按钮新增一个 icon（`Box`）；容器 padding/gap 收紧；保持桌面端原状 |

## 验收

1. 390px 视口：5 张小卡片在 hero 下方一行平铺居中，无需滚动即可看全
2. CreationPanel 控件行 5 个 icon 按钮 + Make 按钮一行排列，不换行
3. 768px 及以上视口：卡片扇形堆叠 + 飞入动画 + 控件完整文字，与之前完全一致
