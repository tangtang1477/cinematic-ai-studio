

## 需求

输入框出现后（已有 `selectedId` 选中态），用户 hover **未选中**的卡片时，让该卡片的透明度从 `0.5` 提升到 `1`，使 hover 反馈更明显。其他状态（去饱和、scale、选中卡片高亮等）全部保持不变。

## 方案

只改一个文件：`src/pages/Index.tsx`

落定卡片 wrapper `<div>` 当前的 className：
```
"hover:!-translate-y-5 hover:!rotate-0 hover:!z-20"
```

追加一条 hover 透明度强制覆盖：
```
"hover:!opacity-100"
```

由于 `opacity` 已经在 inline style 的 `transition` 列表里（`opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)`），hover 时透明度会平滑从 0.5 过渡到 1，无需额外 CSS。

`!` 前缀确保覆盖 inline style 的 `opacity: 0.5`（Tailwind important modifier 生成 `!important`）。

## 不动

- `selectedId` 状态逻辑不动
- 选中卡片的样式（ring / scale / translateY / boxShadow）不动
- 未 hover 时未选中卡片仍然 `opacity: 0.5` + `saturate(0.7)` + `scale(0.96)`
- 去饱和 filter 在 hover 时**保持不变**（用户只要求改透明度）
- TemplateCard、CardBack、FlyingCardsScene、CreationPanel、视频、动效全部不动

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/pages/Index.tsx` | 落定卡片 wrapper className 追加 `hover:!opacity-100` |

## 验收

无痕刷新 → 等卡片落定 → 点击任一卡片 Try this → hover 其他未选中卡片：该卡片透明度平滑提升到 100%（完全不透明），离开后恢复 0.5；选中卡片本身视觉不变。

