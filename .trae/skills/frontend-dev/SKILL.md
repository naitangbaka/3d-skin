---
name: "frontend-dev"
description: "前端开发视觉与交互规范。禁止emoji、极端渐变，强制空间呼吸感、SVG图标、Token化样式、可访问性。Invoke when building UI components, styling pages, or reviewing frontend code."
---

# 前端开发视觉与交互规范

> 定义前端项目的视觉标准、交互原则、图标规范、依赖策略和交付要求。

---

## 优先级声明

当本文件与其它 SKILL 冲突时，按以下顺序仲裁：
1. **type-safety** (类型相关) — 最高优先级
2. **frontend-dev** (视觉相关) — 本文件
3. **fullstack-dev** (架构相关) — 次优先级

**交叉引用**：
- 组件 Props、API 类型、TypeScript 规范 → 参考 [type-safety](../type-safety/SKILL.md)
- 架构决策、技术栈选型 → 参考 [fullstack-dev](../fullstack-dev/SKILL.md)

> 本文件示例默认技术栈为 **React + TypeScript + TailwindCSS**。实际项目若使用其它栈（如 Vue + Less、沿用 CSS Modules），示例中与 Tailwind 相关的写法只需替换为项目既定方案，token 化的原则不变。

---

## 一、核心原则（强制）

### 1.1 禁止使用 Emoji

**任何位置一律禁止 emoji 字符**，包括：
- 文案、按钮、标题
- 注释、占位符
- Toast 提示、空状态
- 错误消息、成功提示

**替代方案**：
- 使用文字描述代替 emoji
- 使用 SVG 图标表达含义
- 使用颜色、字重、字号强调
- 使用图标库中的语义图标

**检查要求**：
- 提交前必须全局搜索 emoji 字符并清除
- 使用正则搜索：`[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]`

```typescript
// ❌ 错误
const successMessage = '✅ 操作成功！';
const emptyState = '📭 暂无数据';

// ✅ 正确
const successMessage = '操作成功';
const emptyState = '暂无数据';
```

### 1.2 禁止极端渐变

**禁止使用的渐变**：
- 高饱和撞色渐变（如紫→橙、青→粉）
- 霓虹发光渐变
- 彩虹渐变
- 强对比多色渐变

**允许的渐变范围**：
- 同色系微渐变（色相差 ≤ 30°，明度差 ≤ 15%）
- 白色/透明遮罩渐变（用于图片蒙层、滚动渐隐）
- 品牌色与其中性邻近色之间的柔和过渡

**使用原则**：
- 渐变仅作为辅助层次，不作为主视觉主体
- 能用纯色表达时优先纯色
- 渐变透明度变化应平缓自然

```css
/* ❌ 错误: 极端渐变 */
background: linear-gradient(135deg, #8B5CF6, #F97316);
background: linear-gradient(90deg, #06B6D4, #EC4899);

/* ✅ 正确: 同色系微渐变 */
background: linear-gradient(135deg, #3B82F6, #2563EB);
background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
```

### 1.3 空间呼吸感

**间距要求**：
- 页面主容器左右安全边距 ≥ 24px（移动端 ≥ 16px）
- 模块之间垂直间距使用 8 的倍数：`8 / 16 / 24 / 32 / 48 / 64`
- 卡片内边距 ≥ 20px，卡片之间间距 ≥ 16px
- 文字行高：正文 1.5–1.7，标题 1.2–1.35

**布局原则**：
- 禁止元素贴边、堆叠拥挤
- 每个视觉块四周必须留白
- 信息密度适中，避免过度紧凑

```css
/* ❌ 错误: 拥挤布局 */
.container {
  padding: 8px;
  gap: 4px;
}

/* ✅ 正确: 呼吸感布局 */
.container {
  padding: 24px;
  gap: 16px;
}

.card {
  padding: 20px;
  margin-bottom: 16px;
}
```

### 1.4 商业化布局

**栅格系统**：
- 桌面端：12 列栅格，间距 24px
- 移动端：4 列栅格，间距 16px
- 平板端：8 列栅格，间距 20px

**信息层级**：
- 主标题 > 副标题 > 正文 > 辅助说明
- 字号与字重递进明确
- 视觉权重逐级递减

**CTA（关键操作）**：
- 主按钮唯一且醒目
- 次按钮弱化（描边/文字按钮）
- 危险操作使用红色系

**对齐规则**：
- 左对齐为主
- 数字/金额可右对齐
- 禁止随意居中
- 组件对齐严格统一

**视觉重心**：
- 稳定平衡，避免大面积留白失衡
- 元素排列有序，禁止东倒西歪
- 重要内容优先展示在视觉热区

---

## 二、图标规范

### 2.1 图标来源优先级

**优先级顺序**：
1. 项目已有图标库（如 `@ant-design/icons`、`lucide-react`、`@iconify/react`、`react-icons` 等）→ **优先复用**
2. 本地 SVG 资源（`/assets/icons/*.svg`）→ 统一命名、统一 `currentColor`
3. 第三方图标库（Iconify、Lucide、Heroicons、Tabler）→ 按需引入，**禁止整包引入**
4. 自绘 SVG → 必须与现有图标风格（线宽、圆角、视觉尺寸）保持一致

### 2.2 图标使用规则

**强制要求**：
- 一律使用 SVG（含 Iconify 等基于 SVG 的按需加载方案）
- 禁止 PNG/JPG 图标
- 默认禁用字体图标；仅当项目已有 iconfont 历史资产时允许保留，且新图标仍优先 SVG

**尺寸规范**：
- 图标尺寸走 token：`14 / 16 / 20 / 24 / 32`
- 禁止随意像素值

**颜色规范**：
- 颜色统一用 `currentColor`，跟随文本色
- 特殊场景可覆盖，但需有明确理由

**交互要求**：
- 可点击图标必须包在按钮或带 `role="button"` 的容器内
- 命中区域 ≥ 40×40px
- 图标按钮必须有 `aria-label`

```tsx
// ❌ 错误: 图标无容器、无标签
<Icon size={18} onClick={handleClick} />

// ✅ 正确: 图标在按钮内，有标签，命中区域足够
<button 
  onClick={handleClick}
  aria-label="删除项目"
  className="p-2 min-w-[40px] min-h-[40px]"
>
  <TrashIcon size={18} />
</button>
```

---

## 三、依赖选择策略

### 造轮子前的检查清单

实现任何特殊功能前，**按顺序执行**：

1. **项目内是否已有同类实现？** → 复用 / 抽象
2. **是否有成熟开源库？** → 优先使用，评估体积、维护状态、License
3. **库是否合适？** → 检查体积/风格/维护状态，考虑裁剪方案
4. **确认无合适方案后** → 才自行实现

### 常见场景推荐库

| 场景 | 推荐库 | 说明 |
|------|--------|------|
| 虚拟滚动 | `@tanstack/react-virtual` | 高性能列表 |
| 拖拽 | `dnd-kit` | 现代化拖拽 |
| 富文本 | `tiptap` | 可扩展编辑器 |
| 图表 | `echarts` / `recharts` | 复杂/简单图表 |
| 日期处理 | `dayjs` / `date-fns` | 轻量日期库 |
| 表单验证 | `react-hook-form` + `zod` | 类型安全表单 |
| 动画 | `framer-motion` | 声明式动画 |
| 表格 | `tanstack-table` | 高级表格功能 |

### 自研要求

确认无合适方案后自行实现，必须满足：
- 有明确边界与类型定义
- 有基础测试或 Storybook 示例
- 代码可复用、可维护、有注释

**核心原则**：能不写就不写，能复用就复用，能引库就引库，实在没有再自研。

---

## 四、样式与 Token

### Design Token 体系

**所有样式统一走 Design Token，禁止魔法数字散落**。

```typescript
// 颜色 Token
const colors = {
  // 主色
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
  // 中性色
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    500: '#737373',
    900: '#171717',
  },
  // 语义色
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

// 间距 Token (8 的倍数)
const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// 圆角 Token
const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// 阴影 Token (最多两级)
const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.07)',
} as const;

// 字体 Token
const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

// 行高 Token
const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;
```

### 阴影克制

- 最多两级：`sm / md`
- 禁止重投影、彩色投影
- 阴影用于区分层级，不用于装饰

### 圆角统一

- 统一值：`4 / 8 / 12 / 16`
- 同一页面内不超过 3 种
- 按钮/卡片常用 `md(8px)`
- 弹窗/大容器可用 `lg(12px)` 或 `xl(16px)`

### 动效规范

- 时长：`150–300ms`
- 缓动：统一 `ease-out` 或 `cubic-bezier(0.4, 0, 0.2, 1)`
- 禁止无意义动画
- 禁止炫技式过渡
- 动效用于反馈交互，不用于吸引注意

```css
/* ✅ 正确: 克制的动效 */
.transition {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ❌ 错误: 炫技动画 */
@keyframes bounce-glow {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
  50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(59,130,246,0.5); }
}
```

---

## 五、交互与可访问性

### 交互状态

所有可交互元素需有完整状态：
- `hover` - 悬停状态
- `active` - 按下状态
- `focus-visible` - 键盘焦点状态
- `disabled` - 禁用状态

### 焦点管理

- `focus-visible` 必须有可见焦点环
- **禁止直接 `outline: none`**
- 焦点环颜色与主题对比度足够

```css
/* ❌ 错误 */
button:focus {
  outline: none;
}

/* ✅ 正确 */
button:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

### 无障碍要求

- 图片必须有 `alt`
- 图标按钮必须有 `aria-label`
- 表单元素必须有 `label` 或 `aria-label`
- 对比度要求：
  - 正文文字对比度 ≥ 4.5:1
  - 大字号对比度 ≥ 3:1

### 键盘操作

- 键盘可操作所有交互
- Tab 顺序合理
- 支持 Escape 关闭弹窗/下拉
- 支持 Enter/Space 触发按钮

---

## 六、代码规范

### 组件规范

> 新 JSX transform 下**无需** `import React`，但 Hooks 需具名导入：`import { useState, useEffect } from 'react';`

- 组件单一职责，**按职责拆分，行数仅作参考**（一个 150 行但做了 3 件事的组件比 250 行只做 1 件事的更该拆）
- 判断组件是否该拆的快速测试：
  - 是否同时处理"数据获取"和"展示"？
  - 是否有 3 个以上不相关的 props？
  - 名字里是否出现 "and" / "Or"？
  - 改 A 功能时，是否总担心影响 B 功能？
  - 以上任一为"是"，考虑拆分
- 组件命名 PascalCase
- 文件命名与组件名一致
- Props 必须有接口定义（规范见 type-safety）

### 样式规范

- 样式优先使用项目既定方案（Tailwind / CSS Modules / styled-components）
- **禁止混用多套样式方案**
- 禁止内联 `style` 承载主题色、间距（动态计算除外）
- 命名语义化，禁止 `div1`、`box2`、`test` 等

### 提交前自检清单

- [ ] 无 emoji
- [ ] 无极端渐变
- [ ] 间距走 token
- [ ] 图标为 SVG 且来自既有资源
- [ ] 特殊功能已确认无现成库
- [ ] 响应式断点覆盖
- [ ] 交互状态齐全
- [ ] 可访问性达标

```tsx
// ❌ 错误示例
function Box1({ data }: any) {
  return (
    <div style={{ padding: 13, margin: 7 }}>
      <span>🎉 成功!</span>
      <div className="box2">{data.name}</div>
    </div>
  );
}

// ✅ 正确示例
// 函数组件省略返回类型注解，由 TypeScript 自动推断（新 JSX transform 无需 import React）
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="p-5 mb-4 bg-white rounded-lg shadow-sm">
      <span className="text-success">操作成功</span>
      <h3 className="text-lg font-medium mt-3">{user.name}</h3>
      <button
        onClick={() => onEdit(user.id)}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-primary"
        // aria-label 覆盖可访问名称，比纯文本"编辑"更富含上下文，屏幕阅读器按此朗读
        aria-label={`编辑用户 ${user.name}`}
      >
        编辑
      </button>
    </div>
  );
}
```

---

## 七、响应式

### 断点统一

> 断点取值对应 Tailwind 默认断点。若项目未使用 Tailwind，仍建议沿用这套通用断点标准（以现代主流设备划分），保证跨框架一致。

| 断点 | 值 | 说明 |
|------|-----|------|
| sm | 640px | 手机横屏 |
| md | 768px | 平板 |
| lg | 1024px | 小屏笔记本 |
| xl | 1280px | 桌面 |
| 2xl | 1536px | 大屏 |

### 移动优先

- 默认样式针对移动端
- 使用 `min-width` 媒体查询逐步增强
- 触控目标 ≥ 44×44px

### 状态覆盖

所有页面必须设计以下状态：
- **长文本** - 截断或换行处理
- **超长数字** - 格式化显示
- **空状态** - 有引导操作
- **加载态** - 骨架屏或 loading
- **错误态** - 有重试/返回操作

```css
/* 移动优先响应式 */
.container {
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .container {
    padding: 24px;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
```

---

## 八、交付标准

一个合格的前端交付物必须满足：

### 视觉
- [ ] 留白充足，空间呼吸感良好
- [ ] 信息层级清晰
- [ ] 商业化质感
- [ ] 无 emoji
- [ ] 无极端渐变

### 图标
- [ ] 全部 SVG
- [ ] 来源统一
- [ ] 风格一致
- [ ] 尺寸走 token

### 技术
- [ ] 优先复用与开源库
- [ ] 自研部分有边界与注释
- [ ] 无魔法数字
- [ ] Token 化

### 体验
- [ ] 响应式完整
- [ ] 交互状态齐全（hover/active/focus/disabled）
- [ ] 可访问性达标
- [ ] 键盘可操作

### 代码
- [ ] 语义化命名
- [ ] 组件单一职责
- [ ] 类型定义完整
- [ ] 可维护、可扩展

---

## 九、TailwindCSS 配置示例（以 Tailwind 为例）

> 以下为使用 Tailwind 时的 token 落地方案。若项目采用 CSS Modules / styled-components / Less，将相同 token 值映射到对应变量机制即可，原则不变。

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          500: '#737373',
          900: '#171717',
        },
      },
      // 自定义 outline 颜色，用于 focus-visible:outline-primary
      // 注意：覆盖 outlineColor 会替换默认调色板（如 outline-red-500 失效），
      //       如需保留默认请显式展开：
      // outlineColor: ({ theme }) => ({
      //   ...theme('colors'),        // 保留默认调色板
      //   primary: '#3B82F6',        // 追加自定义
      // }),
      outlineColor: {
        primary: '#3B82F6',
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 4px 6px rgba(0,0,0,0.07)',
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
      lineHeight: {
        'tight': '1.25',
        'normal': '1.5',
        'relaxed': '1.75',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      transitionTimingFunction: {
        'DEFAULT': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'DEFAULT': '200ms',
      },
    },
  },
}
```

---

## 十、变更记录

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.2.3 | 2026-10-11 | outlineColor 注释补保留默认调色板的展开示例 |
| 1.2.2 | 2026-10-11 | outlineColor 注释改为"覆盖默认调色板"的正确说明 |
| 1.2.1 | 2026-10-11 | 组件规范补 Hooks 具名导入说明与拆分判断标准；Tailwind 配置补 outlineColor |
| 1.2.0 | 2026-10-11 | 组件示例统一省略返回类型（新 JSX transform）；补充 aria-label 无障碍语义注释 |
| 1.1.0 | 2026-10-11 | 增加优先级声明与类型交叉引用；说明示例默认技术栈；放宽字体图标为"历史资产允许保留"；组件拆分改为按职责；补断点来源说明 |

> 跨文件协同变更见**项目根目录**下的 `SKILLS-CHANGELOG.md`

---

**最后更新**: 2026-10-11  
**维护者**: 前端开发团队  
**版本**: 1.2.3