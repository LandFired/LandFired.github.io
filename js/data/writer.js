/*
文件功能：
数据更新模块 —— 调用 GitHub Contents API 把 links.json 写回 nav-data 仓库
*/

// -------------------- 内部函数：b64EncodeUtf8 --------------------
/*
功能：把 UTF-8 字符串编码为 base64（浏览器 btoa 只支持 latin1，需先转字节）
输入：
  str: string
输出：
  string，base64 字符串
*/
function b64EncodeUtf8(str) {
  // 先 URI 编码成百分号转义，再解回 latin1 字节串，最后 btoa
  return btoa(unescape(encodeURIComponent(str)));
}

// -------------------- 内部函数：buildApiUrl --------------------
/*
功能：拼接 GitHub Contents API 的 URL
输入：无（从 APP_CONFIG 读）
输出：
  string，API URL
*/
function buildApiUrl() {
  const cfg = window.APP_CONFIG;
  return `https://api.github.com/repos/${cfg.GITHUB_OWNER}/${cfg.GITHUB_REPO}/contents/${cfg.GITHUB_FILE}`;
}

// -------------------- 内部函数：assertConfigured --------------------
/*
功能：检查 GitHub 相关配置是否齐全，不齐全直接抛错
输入：无
输出：无
*/
function assertConfigured() {
  const cfg = window.APP_CONFIG;
  if (!cfg.GITHUB_OWNER || !cfg.GITHUB_TOKEN) {
    throw new Error("未配置 GitHub：请在 config.js 填入 GITHUB_OWNER 和 GITHUB_TOKEN");
  }
}

// -------------------- 内部函数：fetchSha --------------------
/*
功能：GET 当前文件拿到最新 sha（写回时必须携带）
输入：无
输出：
  Promise<string>，文件 sha
*/
async function fetchSha() {
  const res = await fetch(buildApiUrl(), {
    headers: {
      "Authorization": "Bearer " + window.APP_CONFIG.GITHUB_TOKEN,
      "Accept": "application/vnd.github+json"
    },
    cache: "no-store"
  });
  if (!res.ok) throw new Error("获取 sha 失败: " + res.status);
  const json = await res.json();
  return json.sha;
}

// -------------------- 函数：putLinks --------------------
/*
功能：把完整的 links 数据写回 GitHub 仓库
输入：
  data: {categories, items}
  message: string，可选，提交说明
输出：
  Promise<void>
*/
async function putLinks(data, message) {
  // 前置检查
  assertConfigured();

  // 获取最新 sha
  const sha = await fetchSha();

  // 把数据序列化并 base64 编码
  const jsonStr = JSON.stringify(data, null, 2);
  const content = b64EncodeUtf8(jsonStr);

  // 调用 PUT 接口写回
  const res = await fetch(buildApiUrl(), {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + window.APP_CONFIG.GITHUB_TOKEN,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message || "update links.json",
      content: content,
      sha: sha
    })
  });

  // 非 2xx 时读取错误信息抛出
  if (!res.ok) {
    const text = await res.text();
    throw new Error("写入失败: " + res.status + " " + text);
  }
}

window.DataWriter = { putLinks };
