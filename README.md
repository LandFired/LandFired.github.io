# 导航网页项目

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
