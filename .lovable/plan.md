仅移动端改动（`MobileVideoPlayer.tsx`），桌面端完全不动。

## 1. 删除右侧 Remix 按钮

右侧操作栏（`right: 12, bottom: 120`）当前是 Like / Remix / Share 三个按钮：

- 移除中间的 Remix 按钮（含 `remixIcon` 引用与 "Remix" label）
- 保留 Like 和 Share
- 保留 `MobileRemixInput` 挂载与 `remixOpen` 状态——改由新按钮触发

## 2. 右下角新增 "Recreate" 胶囊按钮

参考附件中右下角"一键同款"绿色胶囊按钮的形状与位置，做英文版：

- 文案：`Recreate`（英文）
- 位置：`absolute`，`right: 16`，`bottom: 32`
- 样式：
  - 胶囊：`height: 44px`，`padding: 0 20px`，`border-radius: 22px`
  - 背景：`#71F0F6`（赛博青，匹配主题色）
  - 文字：`#000`，`fontSize: 15`，`fontWeight: 600`
  - 阴影：`0 4px 16px rgba(198,255,74,0.35)`
  - 交互：`active:scale-95`
- 点击：`setRemixOpen(true)`，复用现有 Remix 输入抽屉

## 3. 底部标题布局微调

原标题区 `bottom: 32, left: 16, right: 80` 调整为 `right: 220`，避免与新按钮重叠。

---

## 涉及文件

**编辑**

- `src/components/MobileVideoPlayer.tsx`

**不动**

- `MobileRemixInput.tsx`、`MobileChannelPage.tsx`、`MobileBottomNav.tsx`、桌面端全部代码
- `remix.svg` 资产保留（不删，仅停用引用）