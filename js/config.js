/*
文件功能：
集中管理所有可配置项，后续接入 GitHub API 时只改这里
*/

// -------------------- 配置区 --------------------
/*
DATA_SOURCE: 本阶段先用本地样例，后续替换成 nav-data 仓库的 raw URL
GITHUB_*:   阶段 4 再填
ADMIN_*:    阶段 3 再用
*/
window.APP_CONFIG = {
  DATA_SOURCE: "https://raw.githubusercontent.com/LandFired/Nav-Data/main/links.json",

  GITHUB_OWNER: "LandFired",
  GITHUB_REPO:  "Nav-Data",
  GITHUB_FILE:  "links.json",
  GITHUB_TOKEN: "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",

  ADMIN_USER: "user",
  ADMIN_PASS: "user"
};
