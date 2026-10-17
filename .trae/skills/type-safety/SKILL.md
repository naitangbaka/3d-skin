---
name: "type-safety"
description: "TypeScript类型安全开发规范。强制严格类型检查、禁止any、API响应类型化、共享类型管理。Invoke when writing TypeScript code, defining interfaces, or reviewing type safety."
---

# TypeScript 类型安全开发规范

> 本项目严格遵循TypeScript类型安全原则，禁止使用any类型，所有代码必须有明确的类型定义

---

## 优先级声明

当本文件与其它SKILL冲突时，按以下顺序仲裁：
1. **type-safety** (类型相关) — 本文件（最高优先级）
2. **frontend-dev** (视觉相关) — 次优先级
3. **fullstack-dev** (架构相关) — 次优先级

**职责边界**：
- 所有类型定义、TypeScript配置、API类型化 → 本文件（唯一来源）
- 视觉规范、交互设计 → 参考 `frontend-dev`
- 架构决策、项目结构 → 参考 `fullstack-dev`

---

## 核心原则

### 1. 强制TypeScript

- **所有前端代码必须是.ts/.tsx文件**
- **所有后端代码必须是.ts文件**
- **禁止使用纯JavaScript**
- **新功能必须先定义类型**

### 2. 禁止any类型

```typescript
// ❌ 错误: 使用any
function processData(data: any): any {
  return data.result;
}

// ✅ 正确: 使用具体类型
interface ProcessResult {
  result: string;
  timestamp: number;
}

function processData(data: InputData): ProcessResult {
  return {
    result: data.value,
    timestamp: Date.now()
  };
}

// ✅ 可接受: 使用unknown(需要类型守卫)
function processUnknown(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }
  throw new TypeError('Expected string');
}
```

### 3. 类型定义优先

开发流程:
1. 定义类型/接口
2. 编写函数/类
3. 实现业务逻辑
4. 编写测试

```typescript
// 步骤1: 先定义类型
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

interface UserResponse {
  success: true;
  data: User;
}

// 步骤2: 基于类型实现功能
class UserService {
  async create(data: CreateUserRequest): Promise<UserResponse> {
    // 实现...
  }
}
```

---

## TypeScript配置

### 严格模式配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    
    // 严格类型检查
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // 额外检查
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // 模块解析
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    
    // 其他
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 类型命名规范

### 命名约定

| 类型 | 命名方式 | 示例 |
|------|----------|------|
| **接口** | PascalCase | `UserResponse`, `ApiConfig` |
| **类型别名** | PascalCase | `UserId`, `UserRole` |
| **Const对象** | PascalCase | `ErrorCode`, `UserStatus` |
| **泛型参数** | 单字母大写 | `T`, `K`, `V`, `R` |
| **Props接口** | 组件名 + Props | `ChatMessageProps` |
| **State接口** | 领域名 + State | `ChatState`, `UserState` |

### 命名示例

```typescript
// ✅ 正确: 接口命名
interface Character {
  id: string;
  name: string;
}

interface CharacterSummary {
  id: string;
  name: string;
  description: string;
}

interface CreateCharacterRequest {
  name: string;
  description: string;
}

// ✅ 正确: 类型别名
type CharacterId = string;
type CharacterRole = 'user' | 'assistant' | 'system';
type Timestamp = number;

// ✅ 正确: Const对象（推荐方案，避免 enum 同名冲突）
// 完整 ErrorCode 全值见「错误码与状态」章节，此处仅演示命名方式
const ErrorCode = {
  VALIDATION_ERROR: 4000,
  NOT_FOUND: 4040,
  CONFLICT: 4090,
  INTERNAL_ERROR: 5001
} as const;

type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

// ✅ 正确: Props接口
interface ChatMessageProps {
  message: ChatMessage;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

// ✅ 正确: State接口
interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
}
```

---

## 共享类型管理

### 类型目录结构

```
shared/types/
├── index.ts           # 统一导出
├── character.ts       # Character相关类型
├── chat.ts            # ChatSession/ChatMessage类型
├── worldbook.ts       # WorldBook相关类型
├── memory.ts          # Memory相关类型
├── config.ts          # AppConfig相关类型
├── api.ts             # API请求/响应类型
└── errors.ts          # 错误码枚举
```

### 类型导出规范

```typescript
// shared/types/character.ts
export interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  scenario: string;
  firstMessage: string;
  systemPrompt?: string;
  postHistoryInstructions?: string;
  worldBookId: string | null;
  avatar: CharacterAvatar;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  schemaVersion: number;
}

export interface CharacterAvatar {
  type: 'path' | 'base64';
  value: string;
  mimeType?: string;
}

export interface CharacterSummary {
  id: string;
  name: string;
  description: string;
  avatar: CharacterAvatar;
  tags: string[];
  chatCount: number;
  lastChatAt: number | null;
}

export interface CreateCharacterRequest {
  name: string;
  description: string;
  personality: string;
  scenario: string;
  firstMessage: string;
  systemPrompt?: string;
  postHistoryInstructions?: string;
  worldBookId?: string | null;
  avatar?: CharacterAvatar;
  tags?: string[];
}

// ✅ 正确: 显式列出所有可更新字段，避免 Partial 掩盖字段语义
export interface UpdateCharacterRequest {
  name?: string;
  description?: string;
  personality?: string;
  scenario?: string;
  firstMessage?: string;
  systemPrompt?: string;
  postHistoryInstructions?: string;
  worldBookId?: string | null;
  avatar?: CharacterAvatar;
  tags?: string[];
}
```

```typescript
// shared/types/index.ts
export * from './character';
export * from './chat';
export * from './worldbook';
export * from './memory';
export * from './config';
export * from './api';
export * from './errors';
```

### 前后端引用

```typescript
// 前端引用
import type { Character, CreateCharacterRequest } from '@/types/character';
// 或从shared导入
import type { Character } from '../../../shared/types';

// 后端引用
import type { Character, CharacterSummary } from '@/types/character';
```

---

## API响应类型化

### 通用响应格式

```typescript
// shared/types/api.ts
// 注意: 这是 ApiResponse / ApiErrorPayload / PaginationInfo 的唯一类型定义来源，
//       fullstack-dev 只做架构说明，不重复定义

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

export interface ApiErrorPayload {
  success: false;
  error: string;
  code: ErrorCode;
  details?: Record<string, unknown>;
  timestamp: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorPayload;

// 分页信息
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationInfo;
}
```

### API客户端类型化

```typescript
// frontend/api/api-client.ts
import axios, { AxiosError } from 'axios';
import type { ApiResponse, ApiErrorPayload } from '@/types/api';
import type { Character, CharacterSummary } from '@/types/character';

class ApiClient {
  private client = axios.create({
    baseURL: '/api',
    timeout: 60000
  });

  // 类型化的API方法
  async getCharacters(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<{ characters: CharacterSummary[]; pagination: PaginationInfo }>> {
    const response = await this.client.get('/characters', { params });
    return response.data;
  }

  async getCharacter(id: string): Promise<ApiResponse<{ character: Character }>> {
    const response = await this.client.get(`/characters/${id}`);
    return response.data;
  }

  async createCharacter(data: CreateCharacterRequest): Promise<ApiResponse<{ character: Character }>> {
    const response = await this.client.post('/characters', data);
    return response.data;
  }

  async updateCharacter(id: string, data: UpdateCharacterRequest): Promise<ApiResponse<{ character: Character }>> {
    const response = await this.client.put(`/characters/${id}`, data);
    return response.data;
  }

  async deleteCharacter(id: string): Promise<ApiResponse<null>> {
    const response = await this.client.delete(`/characters/${id}`);
    return response.data;
  }
}
```

### 错误类型处理

> 命名区分：`ApiErrorPayload`（interface，服务端错误响应体）与 `ApiClientError`（class，前端抛出的错误实例），避免同名冲突，且职责不同。

```typescript
// frontend/api/api-client-error.ts
import type { ApiErrorPayload } from '@/types/api';

export class ApiClientError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: number;

  constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
    Object.setPrototypeOf(this, new.target.prototype);
  }

  isValidationError(): boolean {
    return this.code === ErrorCode.VALIDATION_ERROR;
  }

  isNotFoundError(): boolean {
    return this.code === ErrorCode.NOT_FOUND;
  }

  // 转为与后端一致的 payload 结构
  toPayload(): ApiErrorPayload {
    return {
      success: false,
      error: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

// 错误拦截器
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.data) {
      const { error: message, code, details } = error.response.data;
      throw new ApiClientError(message, code, details);
    }
    throw new ApiClientError('网络连接失败', ErrorCode.INTERNAL_ERROR);
  }
);
```

---

## Props类型定义

### 组件Props规范

```typescript
// ✅ 正确: 明确定义Props
interface CharacterCardProps {
  character: CharacterSummary;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function CharacterCard({ 
  character, 
  onSelect, 
  onEdit, 
  onDelete,
  className 
}: CharacterCardProps) {
  return (
    <div className={className}>
      <h3>{character.name}</h3>
      <p>{character.description}</p>
      {onSelect && <button onClick={() => onSelect(character.id)}>选择</button>}
    </div>
  );
}

// ❌ 错误: 使用内联类型或any
function CharacterCard({ character, onSelect }: any) {
  // ...
}
```

### 可选Props处理

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// 使用默认值
export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  children,
  onClick 
}: ButtonProps) {
  // ...
}
```

---

## 状态类型定义

### Zustand Store类型

```typescript
// frontend/stores/character-store.ts
import { create } from 'zustand';
import type { Character, CharacterSummary, CreateCharacterRequest } from '@/types/character';

interface CharacterState {
  // 状态
  characters: CharacterSummary[];
  selectedCharacter: Character | null;
  isLoading: boolean;
  error: string | null;
  
  // 操作
  loadCharacters: () => Promise<void>;
  selectCharacter: (id: string) => void;
  createCharacter: (data: CreateCharacterRequest) => Promise<void>;
  updateCharacter: (id: string, data: UpdateCharacterRequest) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  selectedCharacter: null,
  isLoading: false,
  error: null,
  
  loadCharacters: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getCharacters();
      set({ characters: response.data.characters });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  selectCharacter: (id) => {
    const character = get().characters.find(c => c.id === id);
    set({ selectedCharacter: character || null });
  },
  
  // ...其他操作
}));
```

---

## 泛型使用

### 泛型接口

```typescript
// 通用仓库接口
interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(params?: QueryParams): Promise<T[]>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

// 实现
class CharacterRepository implements Repository<Character, string> {
  async findById(id: string): Promise<Character | null> {
    // 实现...
  }
  
  async findAll(params?: QueryParams): Promise<Character[]> {
    // 实现...
  }
  
  async create(data: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character> {
    // 实现...
  }
  
  // ...
}
```

### 泛型工具类型

```typescript
// 使用TypeScript内置工具类型
type CharacterCreate = Omit<Character, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'>;
type CharacterUpdate = Partial<CharacterCreate>;
type CharacterReadonly = Readonly<Character>;

// 自定义工具类型
type Nullable<T> = T | null;
type AsyncResult<T> = Promise<{ success: boolean; data?: T; error?: string }>;
type EventHandler<T = void> = T extends void ? () => void : (data: T) => void;
```

---

## 类型守卫（推荐使用 Zod）

> 简单的 `typeof` + `in` 检查无法保证字段的深层类型（如 `id` 是否为 string），
> 推荐统一使用 `zod` 定义运行时校验，兼作类型守卫的数据源。

### 安装与示例

```bash
# 前提: 项目已安装 zod
# npm install zod
```

```typescript
import { z } from 'zod';

// 1. 定义 Schema（单一来源）
const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string()
});

// 2. 推导出类型
type Character = z.infer<typeof CharacterSchema>;

// 3. 类型守卫函数
function isCharacter(data: unknown): data is Character {
  return CharacterSchema.safeParse(data).success;
}

// 4. 解析（校验失败抛错）
function parseCharacter(data: unknown): Character {
  return CharacterSchema.parse(data);
}

// 使用示例
function processResponse(data: unknown): void {
  if (isCharacter(data)) {
    // TypeScript 已收窄 data 为 Character
    console.log(data.name);
  }
}
```

### 简单场景仍可用手写守卫

对于没有 `zod` 的场景，手写守卫必须逐字段做 `typeof` 校验，不能只做 `'id' in data`：

```typescript
function isApiErrorPayload(data: unknown): data is ApiErrorPayload {
  if (typeof data !== 'object' || data === null) return false;
  const candidate = data as Record<string, unknown>;
  return (
    candidate.success === false &&
    typeof candidate.error === 'string' &&
    typeof candidate.code === 'number'
  );
}
```

---

## 错误码与状态（唯一来源）

### 错误码（const对象方案，唯一来源）

> 这是 ErrorCode 的唯一推荐方案与**完整全集**。`fullstack-dev` 等其它文件只引用此定义，不再各自声明。

```typescript
// shared/types/errors.ts
export const ErrorCode = {
  // 客户端错误 4xxx
  VALIDATION_ERROR: 4000,
  AUTHENTICATION_ERROR: 4010,
  AUTHORIZATION_ERROR: 4030,
  NOT_FOUND: 4040,
  CONFLICT: 4090,

  // 服务端错误 5xxx
  INTERNAL_ERROR: 5000,
  DATABASE_ERROR: 5001,
  // 外部服务通用错误（支付/短信等非 AI 外部依赖）
  EXTERNAL_SERVICE_ERROR: 5020,
  // AI 提供商专用错误（AI 超时、限流、鉴权失败等）
  AI_PROVIDER_ERROR: 5021,
  TIMEOUT_ERROR: 5040
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];
```

> **错误码判定规则**：`TIMEOUT_ERROR` 是通用超时（数据库/网络）；当明确由 AI 提供商引发（超时、限流、鉴权失败）时优先 `AI_PROVIDER_ERROR`；其它外部服务（支付/短信）用 `EXTERNAL_SERVICE_ERROR`。若归因不明确，回到对应的 4xxx 或 5xxx 基础错误码。

### 状态/常量（统一 const 对象，不使用 enum）

> 与错误码一致，统一采用 `const 对象 + as const` 方案，避免 enum 的运行时体积与 tree-shaking 问题，并保证全文件风格统一。

```typescript
// 字符串常量
export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];
```

### 为什么统一不使用 enum

- `enum` 的产物包含一个**反向映射对象**（尤其数字枚举），即使只用其中一个成员，整个对象也会被打包保留
- `const 对象 + as const` 在类型层无运行时开销，未使用的成员可被彻底移除（tree-shaking 更彻底）
- `const 对象 + as const` 可配合类型推导，支持字面量狭窄化（`typeof X[keyof typeof X]`）
- 统一用一种方案，避免文件内出现同名 `ErrorCode`/`UserStatus` 冲突，也让 AI 无需在两个方案间随机选择

---

## 类型检查命令

### 开发前检查

```bash
# 类型检查(不生成输出)
tsc --noEmit

# 严格模式检查
tsc --strict

# 显示详细错误信息
tsc --noEmit --pretty
```

### package.json脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix"
  }
}
```

---

## 常见类型错误

### 1. 隐式any

```typescript
// ❌ 错误: 隐式any
function processData(data) {
  return data.value;
}

// ✅ 正确: 明确类型
function processData(data: InputData): string {
  return data.value;
}
```

### 2. 索引访问

```typescript
// ❌ 错误: 可能为undefined
const value = obj[key];

// ✅ 正确: 处理undefined
const value = obj[key];
if (value !== undefined) {
  console.log(value);
}

// 或使用非空断言(谨慎使用)
const value = obj[key]!;
```

> **`noUncheckedIndexedAccess` 专项**：本配置已开启，数组/对象索引进出来的是 `T | undefined`。
> 例如 `CONTAINER_KINDS[container][0]` 的推导结果是 `RecipeKind | undefined`，
> 传给需要 `RecipeKind` 的函数（`convertRecipeData`、`createEmptyRecipeData`）会报 `TS2345`。
> 若业务上保证该索引必然存在，使用 `!` 明确断言：
> ```typescript
> const targetKind = CONTAINER_KINDS[container][0]!; // 明确「下标必然有效」
> ```

### 3. 数组方法

```typescript
// ❌ 错误: filter后可能为undefined
const found = array.filter(item => item.id === id)[0];

// ✅ 正确: 使用find
const found = array.find(item => item.id === id);

// 或处理可能为undefined的情况
const found = array.filter(item => item.id === id)[0];
if (found) {
  // 使用found
}
```

### 4. 对象解构

```typescript
// ❌ 错误: 可能缺少属性
const { name, age } = user;

// ✅ 正确: 使用可选链
const name = user?.name;
const age = user?.age;

// 或定义可选属性
interface User {
  name: string;
  age?: number;
}
```

### 5. 判别联合窄化失效（Discriminated Union Narrowing）

> 这是 `strict` + `noUncheckedIndexedAccess` 项目中最常见的隐性 bug 来源：把判别联合对象的
> **判别字段**与**载荷字段**拆成独立变量后，TypeScript 无法再关联它们，导致窄化完全失效。

#### 错误根源 1：拆分判别字段到独立变量

```typescript
// ❌ 错误: kind 和 data 拆成两个独立变量，TS 丢失「kind 决定 data 类型」的关联
const kind: RecipeKindType = recipe.kind;
const data = recipe.data;   // 推导为 RecipeData(联合)，不再是具体变体
if (kind === RecipeKind.SHAPED) {
  data.pattern;  // TS2339: 联合类型上不存在属性 pattern
}
```

```typescript
// ✅ 正确: 直接用 recipe.kind 判别，再在分支作用域内解构 data
if (recipe.kind === RecipeKind.SHAPED) {
  const { data } = recipe;   // 此时 TS 已完成窄化
  data.pattern;              // 类型正确
}
```

#### 错误根源 2：用联合类型的 kind/data 重新拼装对象

当用 `{ kind, data }`（二者都是联合）构造一个「应该是具体变体」的配方对象时，
TS 无法将 `RecipeKind` 与 `RecipeData` 关联到唯一的 `BrewingMixRecipe` 等变体：

```typescript
// ❌ 错误: kind 是 RecipeKind(联合)、data 是 RecipeData(联合)，不是任何具体变体
return { ...state.draft, kind, data };   // TS2322: 不能赋给 Recipe

// ✅ 正确: 在保证 kind 与 data 运行时必然匹配的前提下（如 convertRecipeData 已按 toKind 生成），
//          用 as Recipe 明确断言，或改用逐一枚举 kind 并返回对应变体
return { ...state.draft, kind, data } as Recipe;
```

> 判定标准：凡是「用运行时保证一致的 kind + data 重新组装」，都可 `as Recipe`；
> 若是数据来自不可控外部输入，则必须用类型守卫，而非断言。

#### 排查清单
- [ ] 是否把 `recipe.kind` / `recipe.data` 提为独立变量？（判别会失效）
- [ ] 是否在 `switch`/`if` 判别后的作用域内才解构 `data`？
- [ ] 重新装配对象时，`kind` 与 `data` 是否都是联合类型？如是，需要 `as` 断言或枚举。

### 6. 未使用声明（TS6133 / TS6192）

> `noUnusedLocals` / `noUnusedParameters` 已开启：未使用的导入、局部变量、函数、参数都会标红（TS6133），
> 未使用的整行 import 标红（TS6192）。修复方式是**删除**，而不是加 `void` 或忽略。

```typescript
// ❌ 错误: TS6133 未使用
import { z } from 'zod';
function asItemStack(...) { ... }

// ✅ 正确: 删除未使用声明；props 接口中保留但函数解构中不取出的参数不会报错
// 例如: onSetCount 只存在于 interface，解构时不取它
function Editor({ recipe, onPickSlot, onRemoveSlot }: EditorProps) { ... }
```

---

## 类型安全最佳实践

### 1. 使用readonly

```typescript
interface Config {
  readonly apiUrl: string;
  readonly maxRetries: number;
}

const config: Config = {
  apiUrl: '/api',
  maxRetries: 3
};

// config.apiUrl = '/new-api'; // 错误! 只读属性
```

### 2. 使用as const

```typescript
const routes = {
  home: '/',
  characters: '/characters',
  chat: '/chat'
} as const;

// routes.home 的类型是 '/' 而不是 string
```

### 3. 使用satisfies

```typescript
const config = {
  port: 3000,
  host: 'localhost'
} satisfies Record<string, number | string>;

// 保持字面量类型的同时验证类型
```

### 4. 避免类型断言

```typescript
// ❌ 错误: 不安全的类型断言
const user = data as User;

// ✅ 正确: 使用类型守卫
if (isUser(data)) {
  const user = data; // TypeScript自动推断
}

// 或使用unknown中间类型
const unknownData = data as unknown;
const user = validateUser(unknownData);
```

### 5. 组件返回类型（统一省略）

> 在新 JSX transform 下无需 `import React`，函数组件建议**省略返回类型注解**，由 TypeScript 自动推断。避免 `React.JSX.Element` 因缺少 `React` 命名空间可见性而报错。

```tsx
// ✅ 推荐: 省略返回类型，TS 自动推断
function MyComponent({ name }: { name: string }) {
  return <div>Hello {name}</div>;
}

// 若必须显式标注，需保证 React 命名空间可见（统一用 namespace import）
import * as React from 'react';
function MyComponent({ name }: { name: string }): React.JSX.Element {
  return <div>Hello {name}</div>;
}
```

---

## 类型检查清单

### 开发前
- [ ] 定义所有需要的类型
- [ ] 检查shared/types是否已有相关类型
- [ ] 确认tsconfig.json启用strict模式

### 开发中
- [ ] 所有函数参数有类型
- [ ] 所有返回值有类型
- [ ] 所有Props有接口定义
- [ ] 没有使用any类型
- [ ] 使用unknown时需要类型守卫

### 提交前
- [ ] 运行`tsc --noEmit`通过
- [ ] 运行`npm run typecheck`通过
- [ ] 没有类型相关的TODO注释
- [ ] 新增类型已导出到shared/types(如需要)

---

## 变更记录

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.3.0 | 2026-10-13 | 「常见类型错误」新增判别联合窄化失效专项（错误根源拆分字段/重装联合对象）与未使用声明 TS6133/TS6192；强化 noUncheckedIndexedAccess 非空断言说明 |
| 1.2.3 | 2026-10-11 | 版本号同步（无实质改动） |
| 1.2.2 | 2026-10-11 | 命名示例 ErrorCode 加注释，指向完整定义章节 |
| 1.2.1 | 2026-10-11 | 补 AI_PROVIDER_ERROR/EXTERNAL_SERVICE_ERROR 判定规则；精化"不用 enum"理由 |
| 1.2.0 | 2026-10-11 | 修复优先级声明笔误；补全 ErrorCode 全值，去除与 EXTERNAL_SERVICE_ERROR 冲突的 AI_PROVIDER_ERROR(5020→5021)；UserStatus 统一 const 对象；错误类型拆分为 ApiErrorPayload/ApiClientError；组件返回类型统一省略 |
| 1.1.0 | 2026-10-11 | 增加优先级声明；ErrorCode 统一改为 const 对象方案；补全 UpdateCharacterRequest 显式字段；ApiResponse/ApiError/PaginationInfo 定为唯一来源；类型守卫改为 Zod 方案 |

> 跨文件协同变更见**项目根目录**下的 `SKILLS-CHANGELOG.md`

---

**最后更新**: 2026-10-13  
**维护者**: AI开发团队  
**版本**: 1.3.0