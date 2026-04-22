## 需求

1. **新增下拉**：CreationPanel 控件行（现有：Model / Duration / AspectRatio / Voice）末尾新增一个"生成模式"下拉，选项：`一键生成`（默认）/ `过程控制`
2. **修复 Bug**：当前 mode = `audiobook` 时，点击卡片 Try this 按钮会被 `handleTry` 强制重置回 `story`，需修复让其保留当前 tab

## 方案

### 改动 1：新增"生成模式"下拉（`src/components/CreationPanel.tsx`）

- 新增类型 `GenerationMode = "Instant" | "Director"`
- props 新增 `generationMode` + `onGenerationModeChange`
- 新增常量数组：
  ```
  const generationModes = [
    { value: "Instant", label: "一键生成" },
    { value: "Director", label: "过程控制" },
  ];
  ```
- 在控件 row 中、Voice 之后、`flex-1` spacer 之前，复制现有 dropdown 样板插入：触发按钮含 `Wand2` 或 `Sparkles` 小图标 + 当前 label + ChevronDown，菜单项与现有同款（hover/selected 用 `text-primary`，背景 `rgba(30,30,30,0.95)`）
- 该下拉在 `story` 和 `audiobook` 两种 mode 下都显示（无条件渲染）
- 在下拉选项悬停（Hover）时，加一行极其简短的小字标签说明文字，详细说明不同模式切换：
  - **Director:** *Co-create with AI step-by-step.*
  - **Instant:** *One-click to magic.*

### 改动 2：父级状态（`src/pages/Index.tsx`）

- 新增 `const [generationMode, setGenerationMode] = useState<"Instant" | "Director">("auto")`
- 传给 `<CreationPanel>` 对应 props

### 改动 3：修复 Bug（`src/pages/Index.tsx` L71-75）

当前：

```tsx
const handleTry = useCallback((templatePrompt: string) => {
  setPrompt(templatePrompt);
  setMode("story");      // ← bug: 强制覆盖
  setShowPanel(true);
}, []);
```

改为：**移除 `setMode("story")` 这一行**。Try this 只负责填充 prompt 和打开面板，不应改变用户当前选中的 tab。

## 不动

- 卡片选中/淡化/hover 逻辑
- 视频、动画、布局、`imageSwapKey` 切换刷新
- 现有 4 个下拉（Model/Duration/AspectRatio/Voice）样式
- handleTryWithSelect 包装函数

## 涉及文件


| 文件                                 | 改动                                                               |
| ---------------------------------- | ---------------------------------------------------------------- |
| `src/components/CreationPanel.tsx` | 新增 `GenerationMode` type 导出 + props + 第 5 个下拉 UI                 |
| `src/pages/Index.tsx`              | 新增 `generationMode` 状态并下传；删除 `handleTry` 中 `setMode("story")` 这行 |


## 验收

1. 输入框出现后控件行末尾出现"一键生成"下拉，点击展开可切换"过程控制"，选中项 cyan 高亮
2. 切到 Audiobooks tab → 点击任一卡片 Try this → tab 保持在 Audiobooks（不再跳回 Stories），prompt 被填入，选中态高亮该卡片