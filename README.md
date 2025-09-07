# WNG Tools

一个基于 Astro + Vue + Tauri 的桌面工具应用。

## 开发环境设置

### 依赖安装

```bash
bun install
```

### 开发服务器

```bash
bun run dev
```

### 构建

```bash
bun run build
```

## 代码质量工具

### Oxc Linter

项目使用 [Oxc](https://oxc.rs/) 作为快速的 JavaScript/TypeScript linter。

#### VS Code 配置

1. 安装 `oxc.oxc-vscode` 扩展（已添加到推荐扩展中）
2. 配置会自动应用，包括：
   - 实时 linting
   - 保存时自动修复
   - 与 Prettier 配合使用（格式化由 Prettier 处理）

#### 命令行使用

```bash
# 检查代码
bun run lint

# 自动修复
bun run lint:fix

# 检查格式化和 linting
bun run check
```

#### 配置说明

- `.oxlintrc.json`: Oxc 配置文件
- 规则级别：`correctness` 和 `suspicious` 设置为警告
- 允许 `console` 使用
- 禁止 `debugger` 语句
- TypeScript/JavaScript 文件使用更严格的规则

### Prettier

代码格式化使用 Prettier。

#### VS Code 配置

- 保存时自动格式化
- 默认格式化器设置为 Prettier

#### 命令行使用

```bash
# 格式化代码
bun run format

# 检查格式化
prettier --check .
```

## 项目结构

```
src/
├── components/
│   └── files.vue          # 文件管理组件
├── pages/
│   └── filespace.astro    # 主页面
└── assets/
    └── icons/             # 图标文件
```

## 技术栈

- **前端框架**: Astro + Vue 3
- **桌面应用**: Tauri 2.x
- **语言**: TypeScript
- **代码质量**: Oxc + Prettier
- **包管理**: Bun
