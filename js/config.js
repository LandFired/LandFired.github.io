/*
文件功能：
集中管理所有可配置项，本阶段使用本地 data 文件
*/

// -------------------- 配置区 --------------------
/*
DATA_SOURCE: 本地导航数据文件
READ_ONLY_LOCAL_DATA: 本地只读模式，所有修改操作只提示不落盘
ADMIN_*: 管理员登录演示账号
*/
window.APP_CONFIG = {
  DATA_SOURCE: "data/links.json",
  READ_ONLY_LOCAL_DATA: true,

  ADMIN_USER: "user",
  ADMIN_PASS: "user"
};
