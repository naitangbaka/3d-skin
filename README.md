<div align="center">

# 3D-SKIN

一个在线的 **Minecraft 皮肤编辑器**，无需安装，直接在浏览器中完成皮肤的预览与编辑。

![Vue](https://img.shields.io/badge/Vue-3.5-42b883)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

## ✨ 功能特性

- **实时 3D 皮肤预览**：基于浏览器 3D 渲染，支持视角旋转与切换
- **灵活的背景选项**：支持纯色与透明背景
- **按玩家名获取皮肤**：输入玩家名即可获取并下载官方皮肤
- **自动保存进度**：编辑进度自动保存，可随时恢复编辑会话
- **全局点击音效**：细腻的音效反馈，提升交互体验

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🛠️ 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`) |
| 状态管理 | [Pinia](https://pinia.vuejs.org/) |
| 构建工具 | [Vite](https://vitejs.dev/) |
| 语言 | [TypeScript](https://www.typescriptlang.org/) |
| UI 组件 | [OreUI Web](https://www.npmjs.com/package/oreui-web) |
| 3D 渲染 | [@daidr/minecraft-skin-renderer](https://www.npmjs.com/package/@daidr/minecraft-skin-renderer) |
| 图标 | [@iconify-prerendered/vue-pixel](https://www.npmjs.com/package/@iconify-prerendered/vue-pixel) |

## 📦 目录结构

```
3d-skin/
├── src/
│   ├── components/          # 组件
│   │   └── skin-renderer/   # 皮肤渲染相关组件
│   ├── composables/         # 组合式函数
│   ├── stores/              # Pinia 状态
│   ├── assets/              # 静态资源
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── index.html
└── package.json
```

## 📄 开源许可证

本项目基于 [MIT](./LICENSE) 许可证开源。

### 第三方依赖许可

本项目使用了以下开源库，遵循各自的开源许可协议：

- [Vue](https://vuejs.org/) — MIT
- [Pinia](https://pinia.vuejs.org/) — MIT
- [OreUI Web](https://www.npmjs.com/package/oreui-web) — MIT
- [@oreui-web/vue](https://www.npmjs.com/package/@oreui-web/vue) — MIT
- [@iconify-prerendered/vue-pixel](https://www.npmjs.com/package/@iconify-prerendered/vue-pixel) — MIT
- [@daidr/minecraft-skin-renderer](https://www.npmjs.com/package/@daidr/minecraft-skin-renderer) — MIT
- [Vite](https://vitejs.dev/) — MIT
- [TypeScript](https://www.typescriptlang.org/) — Apache-2.0