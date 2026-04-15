

## 问题

卡片背面显示黑色，说明 `src/assets/card-back.jpg` 文件内容不正确（可能是之前复制损坏或被覆盖为错误内容）。需要重新用你附件中的扑克牌图片覆盖它。

## 改动

### 1. 替换 `src/assets/card-back.jpg`
- 用 `user-uploads://output_4e65a54f-dc34-46ba-a752-6ccd87eb0b0b-2.jpg` 覆盖 `src/assets/card-back.jpg`
- 不修改任何其他文件，`CardBack.tsx`、`FlippableCard.tsx`、`TemplateCard.tsx`、`Index.tsx` 全部保持不变

仅替换一个图片文件，其余不动。

