---
name: "fullstack-dev"
description: "通用全栈项目开发规范框架。支持React/Vue/Angular前端和Node.js/Python/Java后端。Invoke when starting new fullstack projects, setting up architecture, or needing development guidelines."
---

# 通用全栈项目开发框架

> 专注于架构决策、项目流程和API契约。类型规范见`type-safety`，视觉规范见`frontend-dev`

---

## 优先级声明

当本文件与其它SKILL冲突时，按以下顺序仲裁：
1. **type-safety** (类型相关) — 最高优先级
2. **frontend-dev** (视觉相关) — 次优先级
3. **fullstack-dev** (架构相关) — 本文件

**职责边界**：
- 类型定义、TypeScript配置、API类型化 → 参考 `type-safety`
- 视觉规范、交互设计、样式Token → 参考 `frontend-dev`
- 架构决策、项目结构、部署流程 → 本文件

---

## 项目初始化模板

### 技术栈决策树

**第一步：确定项目类型**
- 单页应用(SPA) → React/Vue + Vite
- 服务端渲染(SSR) → Next.js(React) / Nuxt(Vue)
- 企业后台 → React + Ant Design / Vue + Element Plus
- 移动端优先 → React Native / Flutter

**第二步：确定后端方案**
- Node.js生态 → Express(轻量) / NestJS(企业级)
- Python生态 → FastAPI(高性能) / Django(全功能)
- Java生态 → Spring Boot(企业标准)

**第三步：确定数据库**
- 关系型数据 → PostgreSQL(推荐) / MySQL
- 文档型数据 → MongoDB
- 嵌入式/轻量 → SQLite

**第四步：确定ORM**
- TypeScript + PostgreSQL → Prisma(推荐)
- TypeScript + 多数据库 → TypeORM
- Python → SQLAlchemy
- Java → Hibernate/JPA

**通用原则**：
- 前端语言：TypeScript(大型项目必须)
- 构建工具：Vite(SPA) / Next.js或Nuxt(SSR)
- 状态管理：Zustand(简单) / Redux或Pinia(复杂)

### 项目结构模板

```
project-root/
├── docs/                    # 项目文档
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── components/      # UI组件
│   │   ├── pages/           # 页面组件
│   │   ├── stores/          # 状态管理
│   │   ├── api/             # API调用
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── types/           # 类型定义
│   │   ├── utils/           # 工具函数
│   │   └── styles/          # 全局样式
│   ├── public/              # 静态资源
│   └── package.json
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── routes/          # 路由定义
│   │   ├── controllers/     # 请求处理
│   │   ├── services/        # 业务逻辑
│   │   ├── repositories/    # 数据访问
│   │   ├── middleware/      # 中间件
│   │   ├── config/          # 配置管理
│   │   └── models/          # 数据模型
│   └── package.json
├── shared/                  # 前后端共享代码
│   └── types/               # 共享类型定义
├── data/                    # 运行时数据(可选)
├── .gitignore
└── README.md
```

---

## 架构设计模式

### 分层架构(通用)

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← UI组件/页面
├─────────────────────────────────────┤
│         State Management            │  ← 状态管理/Store
├─────────────────────────────────────┤
│         Business Logic              │  ← Hooks/Services
├─────────────────────────────────────┤
│         Data Access                 │  ← API Client/Repository
└─────────────────────────────────────┘
```

### 后端分层(通用)

```
┌─────────────────────────────────────┐
│         Routes Layer                │  ← URL路由映射
├─────────────────────────────────────┤
│         Controllers Layer           │  ← 请求处理/验证
├─────────────────────────────────────┤
│         Services Layer              │  ← 业务逻辑编排
├─────────────────────────────────────┤
│         Repository Layer            │  ← 数据访问/ORM
├─────────────────────────────────────┤
│         External Services           │  ← 第三方API集成
└─────────────────────────────────────┘
```

### 架构选择指南

| 模式 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| **MVC** | 传统Web应用 | 结构清晰，易于理解 | 层间耦合较高 |
| **分层架构** | 企业级应用 | 职责明确，易于测试 | 可能过度设计 |
| **Clean Architecture** | 大型复杂系统 | 高度解耦，易于维护 | 学习成本高 |
| **微服务** | 分布式系统 | 独立部署，技术多样 | 运维复杂 |

---

## 代码约定框架

### 命名规范(通用)

| 元素 | 命名方式 | 示例 |
|------|----------|------|
| **文件(组件/类)** | PascalCase | `UserService.ts`, `ChatMessage.tsx` |
| **文件(工具/配置)** | kebab-case | `date-utils.ts`, `vite.config.ts` |
| **变量/函数** | camelCase | `userName`, `fetchData()` |
| **常量** | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| **类型/接口** | PascalCase | `UserResponse`, `ApiResponse<T>` |
| **私有成员** | `_`前缀 + camelCase | `_internalState` |

### TypeScript要求

> TypeScript详细规范请参考 `type-safety` SKILL，此处仅列出架构相关要点

1. **严格模式**: 启用`strict: true`（详细配置见`type-safety`）
2. **共享类型**: 放在`shared/types/`目录（管理规范见`type-safety`）
3. **API类型化**: 所有API响应必须有类型定义（规范见`type-safety`）

### 文件组织原则

```
按功能分组，不按文件类型分组

✅ 正确:
components/
├── chat/
│   ├── ChatContainer.tsx
│   ├── ChatMessage.tsx
│   └── ChatInput.tsx
├── user/
│   ├── UserProfile.tsx
│   └── UserList.tsx

❌ 错误:
components/
├── all-components.tsx
├── all-styles.css
```

---

## API设计规范

### RESTful API设计

```
资源命名: 使用名词复数，避免动词
HTTP方法: GET(查询) POST(创建) PUT(更新) DELETE(删除)
URL结构: /api/v1/{resource}/{id}/{sub-resource}

示例:
GET    /api/v1/users           # 获取用户列表
POST   /api/v1/users           # 创建用户
GET    /api/v1/users/:id       # 获取用户详情
PUT    /api/v1/users/:id       # 更新用户
DELETE /api/v1/users/:id       # 删除用户
GET    /api/v1/users/:id/posts # 获取用户帖子
```

### 通用响应格式

> API类型定义统一在 `type-safety` SKILL 的 `shared/types/api.ts` 中管理，此处仅说明架构约定

**响应结构约定**：
- 成功响应：`{ success: true, data: T, message?, pagination? }`
- 错误响应：`{ success: false, error: string, code: ErrorCode, details?, timestamp: number }`
- 分页信息：`{ page, limit, total, totalPages }`

**详细类型定义请参考 `type-safety` SKILL**

### 错误码设计

> ErrorCode 统一在 `type-safety` 中定义，此处说明使用约定

**错误码分段**：
- 客户端错误 4xxx：VALIDATION_ERROR(4000)、AUTHENTICATION_ERROR(4010)、NOT_FOUND(4040)
- 服务端错误 5xxx：INTERNAL_ERROR(5000)、DATABASE_ERROR(5001)、EXTERNAL_SERVICE_ERROR(5020)

**详细定义请参考 `type-safety` SKILL**

### 请求验证

> 运行时校验方案统一采用 `zod`（对 type-safety 的类型守卫章节），此处为架构约定示例。

```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少8位'),
  age: z.number().int().min(0).max(150)
});

type CreateUserInput = z.infer<typeof createUserSchema>;
```

---

## 错误处理策略

### 后端错误处理

```typescript
// ErrorCode 在 shared/types 中为唯一来源，按需导入：
// import { ErrorCode } from '@/types/errors';
// import type { ErrorCode } from '@/types/errors';  // 需要类型时才用 type 导入

// 基础错误类
abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: ErrorCode, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// 具体错误类
class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, ErrorCode.VALIDATION_ERROR, details);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource}不存在: ${id}` : `${resource}不存在`;
    super(message, 404, ErrorCode.NOT_FOUND, { resource, id });
  }
}

// 错误处理中间件
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      details: err.details,
      timestamp: Date.now()
    });
    return;
  }

  // 未预期错误
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    code: ErrorCode.INTERNAL_ERROR,
    timestamp: Date.now()
  });
}

// 异步路由包装器（返回类型标注为 RequestHandler，便于 Express 类型检查）
// 实际项目 import 应放在文件头部
import type { Request, Response, NextFunction, RequestHandler } from 'express';

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

### 前端错误处理

> 错误类型命名与 type-safety 保持一致：`ApiErrorPayload`（响应体 interface）、`ApiClientError`（前端错误实例 class）。

```typescript
// API客户端错误拦截
import type { ApiErrorPayload } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      headers: { 'Content-Type': 'application/json' }
    });

    // 唯一合理的调用点：在构造函数里注册响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorPayload>) => this.handleError(error)
    );
  }

  // 返回 Promise<never>，拦截器通过 await 链自动传播，不会吞错
  // 注意：axios v1.x 会对 rejected handler 的返回 Promise 做 await，
  //       因此 async handleError 的 throw 能正常传播。升级大版本时需复核。
  private async handleError(error: AxiosError<ApiErrorPayload>): Promise<never> {
    if (error.response?.data) {
      const { error: message, code, details } = error.response.data;
      throw new ApiClientError(message, code, details);
    }
    throw new ApiClientError('网络连接失败', ErrorCode.INTERNAL_ERROR);
  }
}

// 错误边界组件
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

---

## 配置管理

### 配置分层

```
1. 默认配置 (代码中硬编码)
   ↓
2. 环境变量 (.env文件)
   ↓
3. 用户配置 (数据库/文件存储)
   ↓
4. 运行时配置 (动态覆盖)
```

### 环境变量规范

```env
# 服务器配置
NODE_ENV=development
PORT=3000
HOST=localhost

# 数据库配置
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
DATABASE_POOL_SIZE=10

# 第三方服务
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
API_KEY=your-api-key

# 功能开关
ENABLE_CACHE=true
ENABLE_LOGGING=true
LOG_LEVEL=debug
```

### 配置验证

```typescript
// 配置验证器
class ConfigValidator {
  static validate(config: AppConfig): void {
    if (!config.database.url) {
      throw new Error('DATABASE_URL is required');
    }
    if (config.server.port < 1024 || config.server.port > 65535) {
      throw new Error('PORT must be between 1024 and 65535');
    }
    if (config.jwt.secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters');
    }
  }
}
```

---

## 状态管理策略

### 前端状态分类

| 状态类型 | 存储位置 | 示例 | 持久化 |
|----------|----------|------|--------|
| **UI状态** | 组件本地状态 | 表单输入、模态框开关 | 否 |
| **应用状态** | 全局Store | 用户信息、主题设置 | 可选 |
| **服务器状态** | 缓存/Store | 列表数据、详情数据 | 否 |
| **URL状态** | 路由参数 | 分页、筛选条件 | 是 |

### Store切分策略

```typescript
// 按领域拆分(推荐)
useUserStore      // 用户相关
useProductStore   // 产品相关
useCartStore      // 购物车相关
useSettingsStore  // 设置相关

// 避免创建全局useAppStore
```

### 状态更新模式

```typescript
// 乐观更新(用户体验好)
optimisticUpdate: async (data) => {
  // 1. 立即更新UI
  setOptimisticData(data);
  
  try {
    // 2. 发送请求
    await api.update(data);
  } catch (error) {
    // 3. 失败时回滚
    rollbackToPreviousState();
    throw error;
  }
}

// 悲观更新(数据一致性好)
pessimisticUpdate: async (data) => {
  // 1. 显示加载状态
  setLoading(true);
  
  try {
    // 2. 发送请求
    const result = await api.update(data);
    
    // 3. 成功后更新UI
    setData(result);
  } finally {
    setLoading(false);
  }
}
```

---

## 数据库设计原则

### 表设计规范

```sql
-- 命名规范: 表名复数，字段名单数
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引策略
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

### ORM使用指南

```typescript
// Prisma示例
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}
```

### 数据迁移策略

```typescript
// 版本控制迁移
interface Migration {
  version: number;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

// 迁移脚本示例
const migration_v2: Migration = {
  version: 2,
  up: async () => {
    await db.schema.alterTable('users').addColumn('avatar_url', 'varchar(255)');
  },
  down: async () => {
    await db.schema.alterTable('users').dropColumn('avatar_url');
  }
};
```

---

## 测试策略

### 测试金字塔

```
        /\
       /  \      E2E Tests (少量)
      /----\
     /      \    Integration Tests (适量)
    /--------\
   /          \  Unit Tests (大量)
  /------------\
```

### 测试类型

| 测试类型 | 测试对象 | 工具 | 覆盖率目标 |
|----------|----------|------|-----------|
| **单元测试** | 函数/类/组件 | Jest/Vitest | 80%+ |
| **集成测试** | API端点/服务 | Supertest | 关键路径100% |
| **E2E测试** | 用户流程 | Playwright/Cypress | 核心功能 |
| **性能测试** | 响应时间/负载 | k6/Lighthouse | 满足SLA |

### 测试示例

```typescript
// 单元测试
describe('UserService', () => {
  it('should create user with valid data', async () => {
    const userData = { email: 'test@example.com', name: 'Test' };
    const user = await userService.create(userData);
    expect(user.id).toBeDefined();
    expect(user.email).toBe(userData.email);
  });

  it('should throw ValidationError for invalid email', async () => {
    const invalidData = { email: 'invalid', name: 'Test' };
    await expect(userService.create(invalidData)).rejects.toThrow(ValidationError);
  });
});

// 集成测试
describe('POST /api/users', () => {
  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test' });
    
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
  });
});
```

---

## Git工作流

### 分支策略

```
main (稳定版本)
  ↑
  └── dev (开发分支)
        ↑
        ├── feature/user-auth
        ├── feature/payment-system
        └── fix/login-bug
```

### 提交规范

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]

type: feat | fix | docs | style | refactor | test | chore
scope: 可选，指明变更的模块或范围
description: 简短描述，使用祈使句
```

### Git操作边界

**AI可以执行**:
- `git status`, `git diff`, `git add`, `git commit`, `git log`, `git branch`, `git checkout`

**AI禁止执行**:
- `git push`, `git pull`, `git fetch`, `git remote`, `git push --force`

---

## 部署策略

### 环境配置

| 环境 | 用途 | 配置 | 数据 |
|------|------|------|------|
| **development** | 本地开发 | 热重载，详细日志 | Mock数据 |
| **staging** | 测试验证 | 类生产配置 | 测试数据 |
| **production** | 线上运行 | 优化构建，最小日志 | 真实数据 |

### 构建优化

```typescript
// Vite构建优化
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['antd', '@ant-design/icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    sourcemap: false
  }
});
```

### 健康检查

```typescript
// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// 数据库健康检查
app.get('/health/db', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ database: 'connected' });
  } catch (error) {
    res.status(503).json({ database: 'disconnected', error: error.message });
  }
});
```

---

## 可执行性验证（CI检查）

> 三份 SKILL 的强制项都需要脚本落地，保证 CI 能自动拦截问题。

### 标准验证脚本

> `check:emoji` 统一用 Node 脚本实现（跨平台、可检测 `.ts/.tsx/.js/.jsx/.vue/.svelte`，避免 grep -P 的跨平台差异）。

```json
// package.json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "check:emoji": "node check-emoji.mjs",
    "lint": "eslint src --ext .ts,.tsx",
    "check:all": "npm run typecheck && npm run lint && npm run check:emoji"
  }
}
```

配套脚本 `check-emoji.mjs`：

```javascript
// check-emoji.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const EMOJI_RE = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
const EXT = /\.(ts|tsx|js|jsx|vue|svelte)$/;
const SKIP = new Set(['node_modules', 'dist', '.git', 'coverage']);
const bad = [];

function walk(dir) {
  for (const ent of readdirSync(dir)) {
    const full = join(dir, ent);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (SKIP.has(ent)) continue;
      walk(full);
    } else if (EXT.test(ent)) {
      const content = readFileSync(full, 'utf8');
      if (EMOJI_RE.test(content)) bad.push(full);
    }
  }
}

// 目标路径从命令行传入，未传则默认 src（支持 monorepo 多目录）
const targets = process.argv.slice(2);
if (targets.length === 0) targets.push('src');
for (const t of targets) walk(t);

if (bad.length) {
  console.error('发现 emoji，禁止使用：\n' + bad.join('\n'));
  process.exit(1);
}
console.log('emoji 检查通过');
```

> 多包扫描可传目录：`"check:emoji": "node check-emoji.mjs src frontend/src backend/src"`

### 提交前链路

1. `npm run typecheck` — 类型检查（type-safety 强项）
2. `npm run lint` — 代码规范
3. `npm run check:emoji` — 视觉强制项（frontend-dev）
4. `npm test` — 单元/集成测试

---

## 性能优化指南

### 前端优化

| 优化项 | 策略 | 工具 |
|--------|------|------|
| **代码分割** | 动态import，路由分割 | Webpack/Vite |
| **图片优化** | WebP格式，懒加载，响应式 | next/image |
| **缓存策略** | HTTP缓存，Service Worker | Workbox |
| **渲染优化** | 虚拟列表，防抖节流 | react-window |
| **状态优化** | 避免不必要的重渲染 | React.memo, useMemo |

### 后端优化

| 优化项 | 策略 | 工具 |
|--------|------|------|
| **数据库** | 索引优化，查询优化，连接池 | EXPLAIN ANALYZE |
| **缓存** | Redis缓存，内存缓存 | Redis, Node-cache |
| **API** | 分页，字段选择，批量操作 | GraphQL, DataLoader |
| **并发** | 异步处理，消息队列 | Bull, RabbitMQ |
| **监控** | 性能监控，错误追踪 | Sentry, New Relic |

---

## 安全最佳实践

### 输入验证

```typescript
// 服务端验证
const validateUserInput = (data: unknown): UserInput => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    name: z.string().min(1).max(50)
  });
  
  return schema.parse(data);
};
```

### 认证授权

```typescript
// JWT认证中间件
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new AuthenticationError('缺少认证令牌');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AuthenticationError('令牌无效');
  }
};
```

### 安全清单

- [ ] 输入验证和清理
- [ ] 参数化查询(防SQL注入)
- [ ] HTTPS强制
- [ ] CORS配置
- [ ] 速率限制
- [ ] 敏感信息加密
- [ ] 安全头设置
- [ ] 依赖漏洞扫描

---

## 可扩展性设计

### 插件系统

```typescript
// 插件接口
interface Plugin {
  name: string;
  version: string;
  install: (app: Application) => Promise<void>;
  uninstall: (app: Application) => Promise<void>;
}

// 插件管理器
class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  async register(plugin: Plugin): Promise<void> {
    await plugin.install(this.app);
    this.plugins.set(plugin.name, plugin);
  }

  async unregister(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (plugin) {
      await plugin.uninstall(this.app);
      this.plugins.delete(name);
    }
  }
}
```

### 事件驱动

```typescript
// 事件总线
class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.push(callback);
    this.listeners.set(event, callbacks);
  }

  emit(event: string, data: unknown): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }
}
```

---

## 文档规范

### 必备文档

| 文档 | 内容 | 维护频率 |
|------|------|----------|
| **README.md** | 项目介绍、快速开始 | 项目初期 |
| **ARCHITECTURE.md** | 架构设计、数据流 | 架构变更时 |
| **API_SPEC.md** | API端点、请求响应 | 每次API变更 |
| **DATA_MODEL.md** | 数据模型、关系 | 数据模型变更 |
| **DEPLOYMENT.md** | 部署流程、环境配置 | 部署流程变更 |
| **CONTRIBUTING.md** | 贡献指南、代码规范 | 初期+重大变更 |

### 文档模板

```markdown
# 文档标题

> 一句话说明文档用途

## 概述
简要说明文档内容和目标读者

## 详细内容
分章节详细说明，使用图表辅助理解

## 示例
提供可运行的代码示例

## 常见问题
列出常见问题和解决方案

## 更新记录
| 日期 | 作者 | 变更内容 |
|------|------|----------|
| YYYY-MM-DD | 作者 | 简要描述 |
```

---

## 项目检查清单

### 开发前
- [ ] 确定技术栈和版本
- [ ] 设计数据库模型
- [ ] 定义API契约
- [ ] 搭建项目结构
- [ ] 配置开发环境
- [ ] 制定代码规范

### 开发中
- [ ] 编写单元测试
- [ ] 代码审查
- [ ] 性能测试
- [ ] 安全扫描
- [ ] 文档更新

### 发布前
- [ ] 全量测试通过
- [ ] 性能指标达标
- [ ] 安全漏洞修复
- [ ] 文档完整更新
- [ ] 部署脚本验证

---

## 变更记录

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.2.3 | 2026-10-11 | handleError 补 axios v1.x await 语义说明；asyncHandler import 位置说明 |
| 1.2.2 | 2026-10-11 | ApiClient 补全构造内响应拦截器注册；check-emoji 增加 SKIP 集合 |
| 1.2.1 | 2026-10-11 | ErrorCode 补导入示例；asyncHandler 标注 RequestHandler；handleError 补调用点；check-emoji 支持多目标路径 |
| 1.2.0 | 2026-10-11 | 前端错误处理统一为 ApiErrorPayload/ApiClientError 命名；check:emoji 移除 grep 版本，统一为 Node 脚本（跨平台） |
| 1.1.0 | 2026-10-11 | 增加优先级声明与职责边界；补齐 type-safety 交叉引用；asyncHandler/Front 错误定义为精确类型；请求验证改用 zod；新增"可执行性验证（CI检查）"章节 |

> 跨文件协同变更见**项目根目录**下的 `SKILLS-CHANGELOG.md`

---

**最后更新**: 2026-10-11  
**维护者**: 全栈开发团队  
**版本**: 1.2.3