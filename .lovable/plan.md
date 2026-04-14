# 3D 模板页面全面改版计划

## 概述

将当前多分类模板页面改版为以 3D 为主题的沉浸式页面，仅展示 4 张 3D 模板卡片，配色切换为 #71F0F6 青色系，输入框置顶，整体突出 3D 氛围感。

## 改动详情

### 1. 配色系统 — `src/index.css`

将 primary 从紫蓝色 `hsl(245 58% 65%)` 切换为 #71F0F6 对应的 HSL 值（约 `183 85% 70%`），同步更新 accent、ring、sidebar-primary 等所有关联变量。`glass-btn` 中的紫色 `rgba(124,107,219,...)` 全部替换为青色系 `rgba(113,240,246,...)`。

### 2. 删除分类系统

- **删除** `src/components/CategoryFilter.tsx` 文件
- `**src/data/templates.ts**`：删除 `categories` 导出，`templates` 数组只保留 4 个 3D 模板（id 11 Dreamcore + 另外 3 个改为 3D 分类或新增）
- `**src/pages/Index.tsx**`：移除 CategoryFilter 引用和 category 状态

### 3. 页面布局重构 — `src/pages/Index.tsx`

```text
┌──────────────────────────────────┐
│  Sidebar │  输入框 (居中, 非满宽)    │  ← 固定顶部
│   88px   ├──────────────────────────┤
│          │           标题         │
│          │  4 张 3D 卡片 (居中，类似扑克牌展开)      │  ← 可滚动区域
│          │                          │
└──────────────────────────────────┘
```

- 输入框 (CreationPanel) 移到页面顶部固定区域，设定 `max-width`（约 720px）居中
- 标题和卡片在下方可滚动区域
- 4 张卡片使用卡牌扇形展开布局，体现3D感，居中展示

### 4. 3D 氛围感设计

- **背景**：添加微妙的径向渐变光晕（青色系），从页面中心向外扩散，`radial-gradient(ellipse at 50% 60%, rgba(113,240,246,0.06) 0%, transparent 70%)`
- **标题样式**：标题文字添加青色微光 `text-shadow`，副标题带轻微发光
- **卡片区域**：卡片带有青色边框高光 `hover:ring-[#71F0F6]/40`，卡片之间添加间距让布局更有呼吸感
- **装饰元素**：在背景中添加 CSS 实现的浮动光点/光圈动画，增强 3D 科技氛围
- 整个页面可以设计成一本魔法书，增加美观性和趣味性

### 5. 尺寸选择重新设计 — `src/components/CreationPanel.tsx`

现在有 4 种尺寸：16:9、9:16、3:4、4:3，不再适合用 icon+比例文字的方式。改为**下拉选择器**：

- 触发按钮显示当前选中的比例文字（如 "16:9"），前面放一个小的比例示意矩形 SVG
- 点击后下拉菜单列出 4 个选项，每个选项前面用一个小矩形图示表示比例
- 类型从 `"landscape" | "portrait"` 改为 `"16:9" | "9:16" | "3:4" | "4:3"`

### 6. 更新 `src/components/HeroSection.tsx`

标题和副标题更新为 3D 主题相关文案，添加青色发光效果。

## 需要修改的文件


| 文件                                  | 改动                                      |
| ----------------------------------- | --------------------------------------- |
| `src/index.css`                     | primary 配色改为 #71F0F6 青色系，glass-btn 颜色同步 |
| `src/data/templates.ts`             | 删除 categories，只保留 4 个 3D 模板             |
| `src/pages/Index.tsx`               | 删除分类，输入框置顶，卡片 2×2 布局，3D 背景氛围            |
| `src/components/CreationPanel.tsx`  | 尺寸改为 4 选项下拉，非满宽居中                       |
| `src/components/HeroSection.tsx`    | 3D 主题文案，青色发光效果                          |
| `src/components/CategoryFilter.tsx` | 删除                                      |
