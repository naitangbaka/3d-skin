---
name: "oop-design"
description: "OOP design principles: when to use OOP vs functions, avoid procedural/result-oriented coding. Invoke when writing new modules, refactoring, or reviewing architecture."
---

# 面向对象设计规范

## 核心原则

### 0. 依赖选择优先级
实现功能时，按以下优先级选择依赖来源：

1. **优先使用成熟的第三方库** — 社区验证过的方案，活跃维护，文档齐全
2. **其次查找项目内已有封装** — 项目已有公共组件/工具函数/API 层，避免重复造轮子
3. **最后才自己实现** — 前两条都不可行时，自己动手写

```typescript
// ✅ 优先：使用标准库或成熟第三方库
import { format, parseISO } from "date-fns";  // 日期处理，有现成的
import { z } from "zod";                       // 数据校验，有现成的

// ✅ 其次：优先复用项目已有封装
import { httpClient } from "@/lib/http";        // 项目已有的 HTTP 封装
import { useAuth } from "@/hooks/useAuth";      // 项目已有的认证 Hook

// ❌ 不要自己造轮子
// 不要手写一个 date parser，不要手写一个 HTTP request wrapper
// 不要手写一个表单校验，除非上面两条都确实不可行
```

**自检清单**：
- 这个功能是否有知名开源库可以解决？（查 npm / PyPI / 社区推荐）
- 项目中是否已有类似功能的封装？（搜索代码库的公共模块）
- 如果自己实现，维护成本是否值得？（考虑边界情况、安全、性能、后续升级）

### 1. 禁止面向过程编程
**不要**将业务逻辑写成一步步的过程式调用。过程式代码的典型特征：
- 一个巨大的函数包含所有步骤
- 数据与行为分离（裸数据 + 外部处理函数）
- 通过参数传递 mutable 状态，层层穿透

**正确做法**：将数据和行为封装为有明确职责的类，通过对象协作完成任务。

```typescript
// ❌ 面向过程：数据裸奔，行为外挂
function processOrder(orderData: any) {
  validateOrder(orderData);
  const price = calculatePrice(orderData);
  const discount = getDiscount(orderData.userId);
  orderData.finalPrice = price - discount;
  saveOrder(orderData);
  sendEmail(orderData.email);
}

// ✅ 面向对象：数据与行为内聚
class Order {
  constructor(private user: User, private items: Item[]) {}

  process(): void {
    this.validate();
    const finalPrice = this.calculateFinalPrice();
    this.save(finalPrice);
    this.user.notifyOrderCompleted(this);
  }

  private calculateFinalPrice(): number {
    const basePrice = this.items.reduce((sum, i) => sum + i.price, 0);
    return basePrice - this.user.discountFor(this);
  }
}
```

### 2. 禁止面向结果编程
**不要**为了快速完成用户需求而牺牲代码结构。典型表现：
- 在已有类上不断追加 if/else 分支
- 不做重构，只在原代码上打补丁
- 为了"少改代码"而选择耦合方案
- 复制粘贴相似逻辑而不抽取公共抽象

**正确做法**：每次添加功能时，花时间思考正确的抽象层级。如果现有结构无法优雅支持新需求，先重构再添加。

### 3. 可扩展性优先于快速交付
设计时自问：
- 如果明天要加一种新的 X 类型，我需要改多少处代码？
- 这个类的职责是否单一？换一个需求场景，它能否复用？
- 外部调用者是否需要了解内部实现细节才能使用？

**开闭原则（OCP）**：对扩展开放，对修改关闭。新增功能应该通过添加新代码实现，而非修改已有代码。

```typescript
// ❌ 每次加新类型都要改这里（违反 OCP）
function getDiscount(user: User): number {
  if (user.type === "normal") return 0;
  if (user.type === "vip") return 0.1;
  if (user.type === "svip") return 0.2; // 新增就要改这里
}

// ✅ 新增类型只需新增类（符合 OCP）
interface DiscountStrategy {
  getDiscount(): number;
}

class NormalDiscount implements DiscountStrategy {
  getDiscount() { return 0; }
}
class VipDiscount implements DiscountStrategy {
  getDiscount() { return 0.1; }
}
// 新增 SVIP：加一个类即可，不改任何已有代码
class SvipDiscount implements DiscountStrategy {
  getDiscount() { return 0.2; }
}
```

---

## 何时使用 OOP（Class） vs 函数（Function）

### 适合用 Class 的场景
| 场景 | 判断标准 |
|------|----------|
| **有状态实体** | 数据有生命周期，需要在多个方法间共享和修改 |
| **需要多态** | 同一行为有多种实现，需要运行时动态替换 |
| **资源管理** | 需要初始化/释放的资源（数据库连接、文件句柄等） |
| **领域模型** | 表达业务概念的实体（Order、User、Product 等） |
| **对外暴露多个相关操作** | 一组函数共享同一份配置或上下文 |

```typescript
// ✅ 有状态、需要多态 → 用 Class
abstract class PaymentGateway {
  abstract charge(amount: number): Promise<ChargeResult>;
  abstract refund(transactionId: string): Promise<void>;
}

class StripeGateway extends PaymentGateway {
  constructor(private apiKey: string) {} // 状态：API 密钥
  async charge(amount: number) { /* Stripe 实现 */ }
  async refund(transactionId: string) { /* Stripe 实现 */ }
}
```

### 适合用 Function 的场景
| 场景 | 判断标准 |
|------|----------|
| **纯计算/转换** | 输入 → 输出，无副作用，不依赖外部状态 |
| **工具函数** | 通用且无状态的辅助操作（格式化、校验、转换等） |
| **组合/编排** | 将多个小函数组合成流程（pipe/compose 模式） |
| **单次操作** | 只需要一个行为的简单操作，没必要单独成类 |

```typescript
// ✅ 无状态、纯转换 → 用 Function
function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ 组合函数完成流程
const processPayment = pipe(
  validateOrder,
  calculateTotal,
  chargeCustomer,
  sendReceipt,
);
```

---

## 避免过度封装

**过度封装信号**：
- 一个类只有一个方法（可能是 `run()` / `execute()`），无其他行为 → 改成函数
- 一个接口只有一个实现，且未来几乎不会有第二个实现 → 先别抽象，YAGNI（You Aren't Gonna Need It）
- 为了"标准"而引入大量间接层（FactoryFactory 式的套娃）
- 一个类的字段全是 getter/setter，没有任何真实行为 → 可能是贫血模型

```typescript
// ❌ 过度封装：一个类只有一个方法，改成函数更清晰
class PasswordHasher {
  hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}

// ✅ 直接用函数
function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

// ❌ 过度抽象：只有一个实现就引入接口
interface ILogger {
  log(msg: string): void;
}
class ConsoleLogger implements ILogger {
  log(msg: string) { console.log(msg); }
}

// ✅ 先直接用具体类，等真正出现第二个实现时再抽象
class Logger {
  log(msg: string) { console.log(msg); }
}
```

---

## 设计决策速查

| 问题 | 答案 |
|------|------|
| 这段逻辑有状态吗？ | 有 → Class / 无 → Function |
| 需要运行时替换实现吗？ | 是 → 接口/抽象类 / 否 → 具体类或函数 |
| 未来大概率会扩展吗？ | 是 → 预留扩展点（策略/插件模式）/ 否 → YAGNI，先简单实现 |
| 这个类有几个 public 方法？ | 1 个 → 考虑改成函数 / 2+ → 保持类 |
| 新增功能需要改几处？ | 1 处 → 良好 / 3+ 处 → 考虑重构 |

---

## SOLID 原则精要

1. **SRP 单一职责**：一个类只应该因为一个原因被修改。如果一个类承担了多个职责，拆分它。
2. **OCP 开闭原则**：对扩展开放，对修改关闭。加功能 = 加代码，不改已有代码。
3. **LSP 里氏替换**：子类必须能完全替代父类。不要写出"is-a 但实际不能用"的继承。
4. **ISP 接口隔离**：接口应该小而精，调用方不应该依赖它不需要的方法。
5. **DIP 依赖倒置**：依赖抽象（接口）而非具体实现。高层模块和低层模块都依赖抽象。

---

## 工作流程

接到需求时，按以下顺序思考：

1. **理解领域** → 识别核心实体和行为
2. **定义接口** → 先定契约（interface/type），再定实现
3. **分配职责** → 谁拥有这个行为？谁持有这份数据？
4. **确定抽象层级** → 哪些是可变策略（需要多态），哪些是固定逻辑（可以直接实现）
5. **编写代码** → 先写调用方代码（自顶向下），再填充实现
6. **自检** → 用上面的"设计决策速查"快速过一遍

---

## 优先级声明

当本文件与其它 SKILL 冲突时，按以下顺序仲裁：

1. **type-safety**（类型相关）— 最高优先级
2. **frontend-dev**（视觉/交互相关）— 次优先级
3. **fullstack-dev**（架构/技术栈相关）
4. **oop-design**（设计范式/封装级别相关）— 本文件

**职责边界**：
- 类型定义、TypeScript 配置 → 参考 `type-safety`
- 视觉规范、交互设计、样式 Token → 参考 `frontend-dev`
- 架构决策、项目结构、部署流程 → 参考 `fullstack-dev`
- Class vs Function 决策、封装粒度、SOLID 原则 → 本文件

---

## 变更记录

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.1 | 2026-10-14 | 新增核心原则「依赖选择优先级」（第三方库 → 项目已有封装 → 自己实现）；补齐优先级声明、变更记录、版本元信息 |
| 1.0.0 | 2026-10-14 | 初版。定位为 OOP 设计范式规范：禁止面向过程/面向结果编程，Class vs Function 决策指南，避免过度封装，SOLID 原则精要，设计决策速查表 |

> 跨文件协同变更见**项目根目录**下的 `SKILLS-CHANGELOG.md`

---

**最后更新**: 2026-10-14  
**维护者**: AI开发团队  
**版本**: 1.0.1