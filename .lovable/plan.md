## 需求

落定后的 5 张卡片，点击其中一张try this按钮时高亮显示该卡片，其余卡片保持原样视觉淡化（让被选中的更突出），再次点击同一张取消选中或点击别张切换。

## 方案

只改一个文件：`src/pages/Index.tsx`

### 状态

新增 `const [selectedId, setSelectedId] = useState<string | null>(null)`

### 交互

落定卡片的 wrapper `<div>` 上：

- `onClick={() => setSelectedId(prev => prev === t.id ? null : t.id)}`
- 根据 `selectedId` 计算样式：
  - **被选中卡片**：`ring-2 ring-primary` + 上浮 `translateY(-20px)` + `rotate(0deg)` 拉正 + `scale(1.05)` + 提升 `zIndex: 30` + 强化阴影/cyan glow
  - **未选中卡片**（当 `selectedId !== null` 时）：`opacity: 0.5` + 轻微 `scale(0.96)` + 去饱和 `filter: saturate(0.7)`
  - **无任何选中时**：保持当前默认扇形样式不变

### 视觉细节

- transition `0.35s cubic-bezier(0.4, 0, 0.2, 1)`，与现有 hover 0.3s 协调
- 高亮 ring 用 `hsl(var(--primary))`（项目 primary cyan #71F0F6 一致）
- 保留现有 hover 效果（hover 时 `-translate-y-5 rotate-0 z-20`）—— 选中态优先级高于 hover

### 不动

- FlyingCardsScene、TemplateCard、CardBack 不改一行
- 视频、动效、布局、扇形落定基础 transform 保持
- CreationPanel 触发逻辑（"Try this" 按钮）不变

## 涉及文件


| 文件                    | 改动                                                               |
| --------------------- | ---------------------------------------------------------------- |
| `src/pages/Index.tsx` | 新增 `selectedId` 状态；落定卡片 `<div>` 增加 onClick + 条件样式（高亮/淡化/上浮/ring） |


## 验收

无痕刷新 → 等卡片落定 → 点击任一张：该卡片上浮拉正高亮带 cyan ring，其他 4 张半透明淡化；再点同一张恢复，点别张切换。