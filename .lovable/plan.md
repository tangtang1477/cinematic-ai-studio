

## 需求

1. **暗色蒙层**：输入框出现后（`showPanel === true`），在背景视频上方叠加一层半透明暗色蒙层，让输入框更清晰突出
2. **容器宽度翻倍**：CreationPanel 容器 `max-w-[720px]` → `max-w-[1440px]`（原始宽度的 2 倍），保持居中、保持响应式
3. **极简白色滚动条**：textarea 内容超出时显示低透明度的白色细滚动条（参考附件图：很细、半透明白色、无背景轨道）

## 方案

### 改动 1：暗色蒙层（`src/pages/Index.tsx`）

在视频背景层（`fixed inset-0 z-0` 那个 div）内、所有 video 元素之后，新增一个蒙层 div：

```tsx
<div
  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
  style={{
    background: "rgba(0,0,0,0.45)",
    opacity: showPanel ? 1 : 0,
  }}
/>
```

- 仅在 `showPanel = true` 时淡入
- `pointer-events-none` 不影响交互
- 透明度 0.45 让背景视频依然可见但显著压暗
- 与输入框的 0.45s 淡入同步

### 改动 2：容器宽度翻倍（`src/components/CreationPanel.tsx` L182）

```tsx
<div className="w-full max-w-[720px] mx-auto px-4 pt-4 pb-2">
```

改为：

```tsx
<div className="w-full max-w-[1440px] mx-auto px-4 pt-4 pb-2">
```

`mx-auto` 保留居中，`w-full` 自适应，小屏自动收缩。

### 改动 3：textarea 极简滚动条（`src/components/CreationPanel.tsx`）

textarea `rows={2}` 改为 `rows={3}`（容器变宽后给更多写作空间），添加 `max-h-[120px] overflow-y-auto` 和自定义滚动条 className：

```tsx
className="... resize-none focus:outline-none leading-relaxed
  max-h-[120px] overflow-y-auto thin-scrollbar"
```

在 `src/index.css` 全局新增 `.thin-scrollbar` 样式（webkit + firefox 双兼容）：

```css
.thin-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}
.thin-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.thin-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.thin-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
}
.thin-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.35);
}
```

效果：4px 极细、20% 白色透明度、圆角、无轨道背景，与附件图一致。

## 不动

- 视频/loop/intro 播放、phase 状态机、卡片飞入与落定逻辑
- CreationPanel 5 个下拉、Tabs、Make 按钮、玻璃外框样式
- 选中/淡化/hover 卡片交互、`imageSwapKey` 切换刷新
- 父级所有其他状态

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/pages/Index.tsx` | 视频层内新增 dark overlay div（受 `showPanel` 控制淡入淡出） |
| `src/components/CreationPanel.tsx` | 外层容器 `max-w-[720px]` → `max-w-[1440px]`；textarea 加 `max-h` + `overflow-y-auto` + `thin-scrollbar` |
| `src/index.css` | 新增全局 `.thin-scrollbar` 样式（webkit + firefox） |

## 验收

1. 输入框未出现时：视频清晰无蒙层；输入框淡入时：背景同步压暗 45%，输入框对比度显著提升
2. 容器宽度从 720px 扩到 1440px，1454px 视口下接近通栏，居中对齐
3. 在 textarea 中输入超过 3 行的文本：右侧出现 4px 宽、半透明白色细滚动条，无轨道背景，与附件图样式一致

