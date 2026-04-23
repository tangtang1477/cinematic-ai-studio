

## 需求修正

之前误把"宽度翻倍"实现了，实际需求是：
1. **宽度回退**：CreationPanel 容器 `max-w-[1440px]` → 恢复 `max-w-[720px]`
2. **高度自适应**：textarea 随文本长度纵向拉长，最大高度为默认高度的 2 倍
3. **保留**：极简白色细滚动条（达到 max-height 后出现）、暗色蒙层

## 方案

### 改动 1：宽度回退（`src/components/CreationPanel.tsx` L182）

```tsx
<div className="w-full max-w-[1440px] mx-auto px-4 pt-4 pb-2">
```

改回：

```tsx
<div className="w-full max-w-[720px] mx-auto px-4 pt-4 pb-2">
```

### 改动 2：textarea 高度自适应（`src/components/CreationPanel.tsx`）

当前 textarea 是固定 `rows={3}` + `max-h-[120px] overflow-y-auto`，无法随文本动态拉长（rows 只决定初始高度，不会随内容增长，需要 JS 控制 `scrollHeight`）。

改造：
- `rows={2}` 作为默认（约 ~48px 内容高度，对应原始版本默认值）
- 新增 `useRef<HTMLTextAreaElement>` + `useEffect` 监听 `prompt` 变化，自动设置 `el.style.height = "auto"` 然后 `el.style.height = Math.min(el.scrollHeight, MAX) + "px"`
- `MAX = 默认 rows=2 高度 × 2`：以行高 `leading-relaxed`(1.625) × `text-[14px]`(14px) ≈ 22.75px/行计，2 行 ≈ 46px，2 倍 ≈ 92px。取整 **MAX = 96px**（约 4 行内容）
- textarea className：移除 `max-h-[120px]`，改为 `overflow-y-auto thin-scrollbar`，高度交由 inline style 控制
- 达到 96px 后内容继续增加，自动出现已实现的 `thin-scrollbar` 细滚动条

代码片段：
```tsx
const textareaRef = useRef<HTMLTextAreaElement>(null);
const MAX_HEIGHT = 96; // 默认 2 行 ≈ 48px 的 2 倍

useEffect(() => {
  const el = textareaRef.current;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + "px";
}, [prompt]);
```

textarea 元素：
```tsx
<textarea
  ref={textareaRef}
  value={prompt}
  onChange={(e) => onPromptChange(e.target.value)}
  placeholder={...}
  rows={2}
  className="w-full bg-transparent text-[14px] text-foreground placeholder:text-foreground/25
    resize-none focus:outline-none leading-relaxed
    overflow-y-auto thin-scrollbar"
/>
```

## 不动

- 暗色蒙层（`src/pages/Index.tsx`）
- `.thin-scrollbar` 全局样式（`src/index.css`）
- 5 个下拉、Tabs、Make 按钮、玻璃外框
- 视频/卡片/状态机所有逻辑

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/components/CreationPanel.tsx` | 容器宽度 `max-w-[1440px]` 改回 `max-w-[720px]`；textarea 加 `useRef` + `useEffect` 自适应高度（最大 96px）；移除固定 `max-h-[120px]` |

## 验收

1. 容器宽度恢复 720px（与最早版本一致），居中
2. textarea 默认 2 行高度；输入 1 行 → 高度不变；输入到第 3、4 行 → 容器纵向平滑拉长；达到 96px（约 4 行）后高度封顶，超出部分出现极简白色细滚动条
3. 暗色蒙层、滚动条样式、其他所有交互保持不变

