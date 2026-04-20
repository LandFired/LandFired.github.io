# 导航网页项目

## 功能特性

- ✅ 导航条目展示（按分类分组）
- ✅ 搜索功能（标题/网址）
- ✅ 分类过滤
- ✅ 管理员登录（前端账号密码）
- ✅ 新增/删除/编辑条目
- ✅ 新增/删除分类
- ✅ 拖拽排序（管理员模式）
- ✅ 数据存储在独立 GitHub 仓库
- ✅ 自动同步到 GitHub（每次操作自动提交）

## 文件夹结构

```
导航网页/
├── index.html                    # 入口页面，加载样式和脚本
├── README.md                     # 项目说明文档
├── CLAUDE.md                     # Claude 协作规范
├── assets/
│   └── style.css                 # 全站样式表
├── data/
│   └── links.sample.json         # 本地样例数据，联调阶段使用
└── js/
    ├── config.js                 # 配置区，集中管理数据源、token、管理员账号
    ├── data/
    │   ├── reader.js             # 数据读取模块，从数据源拉取 links.json
    │   └── writer.js             # 数据更新模块，调用 GitHub API 写回 links.json
    ├── logic/
    │   ├── filter.js             # 过滤模块，按关键词和分类组合筛选
    │   ├── auth.js               # 认证模块，校验管理员账号密码，读写登录状态
    │   └── items.js              # 条目管理模块，生成 id、新增删除编辑条目、新增删除分类、拖拽排序
    └── ui/
        ├── render.js             # 导航展示模块，按分类渲染卡片，支持拖拽排序
        ├── toolbar.js            # 工具栏模块，渲染分类按钮栏
        ├── admin.js              # 管理界面模块，登录按钮与登录模态框
        ├── item-form.js          # 条目表单模块，新增和编辑条目的按钮与模态框
        ├── category-form.js      # 分类表单模块，新增分类的按钮与模态框
        └── app.js                # 应用主入口，持有状态，串联所有模块
```

## 配置说明

编辑 `js/config.js`：

```js
window.APP_CONFIG = {
  // 数据源：本地测试用 ./data/links.sample.json，部署后用 GitHub raw URL
  DATA_SOURCE: "https://raw.githubusercontent.com/你的用户名/nav-data/main/links.json",
  
  // GitHub 仓库配置
  GITHUB_OWNER: "你的用户名",
  GITHUB_REPO:  "nav-data",
  GITHUB_FILE:  "links.json",
  GITHUB_TOKEN: "ghp_你的token",  // 需要 repo 权限
  
  // 管理员账号（前端校验，非安全边界）
  ADMIN_USER: "admin",
  ADMIN_PASS: "admin123"
};
```

## 部署到 GitHub Pages

1. 在 GitHub 创建 `nav-frontend` 仓库（存放前端代码）
2. 在 GitHub 创建 `nav-data` 仓库（存放 `links.json`）
3. 生成 GitHub Token（Settings → Developer settings → Personal access tokens → Generate new token，勾选 `repo` 权限）
4. 修改 `js/config.js` 填入配置
5. 推送 `nav-frontend` 到 GitHub
6. 在 `nav-frontend` 仓库 Settings → Pages 中启用 GitHub Pages（选择 main 分支）
7. 访问 `https://你的用户名.github.io/nav-frontend/`

## 本地开发

```bash
cd 导航网页
python -m http.server 8080
```

访问 `http://localhost:8080/`

## 使用说明

### 普通用户
- 浏览导航条目
- 使用搜索框搜索标题或网址
- 点击分类按钮过滤条目

### 管理员
1. 点击右上角"管理员登录"
2. 输入账号密码（默认 admin/admin123）
3. 登录后可以：
   - 新增/删除/编辑条目
   - 新增/删除分类
   - 拖拽卡片调整顺序
4. 所有操作自动同步到 GitHub 仓库
