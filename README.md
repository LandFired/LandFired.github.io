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
│   ├── links.json                # 当前页面实际读取的本地导航数据
│   └── links.sample.json         # 本地样例数据，便于备份和参考
└── js/
    ├── config.js                 # 配置区，集中管理本地数据源、只读模式与管理员账号
    ├── data/
    │   ├── reader.js             # 数据读取模块，从本地 data/links.json 拉取数据
    │   └── writer.js             # 只读提示模块，统一拦截写操作
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

## 当前行为

- 页面默认读取本地 `data/links.json`。
- 搜索和分类筛选仍可正常使用。
- 新增、编辑、删除、排序、分类管理等写操作已改为前端弹窗提示“暂不支持”，不再请求 GitHub API。
