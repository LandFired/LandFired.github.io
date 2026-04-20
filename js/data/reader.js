/*
文件功能：
数据读取模块 —— 从配置的 DATA_SOURCE 拉取 links.json
*/

// -------------------- 函数：fetchLinks --------------------
/*
功能：读取导航数据
输入：无（从 APP_CONFIG 读 DATA_SOURCE）
输出：Promise<{categories:string[], items:object[]}>
*/
async function fetchLinks() {
  // 请求数据源
  const res = await fetch(window.APP_CONFIG.DATA_SOURCE, { cache: "no-store" });
  if (!res.ok) throw new Error("读取数据失败: " + res.status);
  return await res.json();
}

window.DataReader = { fetchLinks };
