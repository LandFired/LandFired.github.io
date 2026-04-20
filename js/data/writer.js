/*
文件功能：
数据更新模块 —— 本地 data 只读模式下统一返回不支持提示
*/

// -------------------- 内部函数：buildReadonlyMessage --------------------
/*
功能：生成本地 data 只读模式下的统一提示文案
输入：
  action: string，可选，当前尝试执行的动作
输出：
  string，提示文案
*/
function buildReadonlyMessage(action) {
  // 统一提示当前页面只能读取本地文件，不能直接写回
  const actionText = action || "修改数据";
  return `当前使用本地 data/links.json，暂不支持${actionText}。请直接编辑 data/links.json`;
}

// -------------------- 函数：putLinks --------------------
/*
功能：本地只读模式下阻止数据写入
输入：
  data: {categories, items}
  message: string，可选，提交说明
输出：
  Promise<void>，始终抛错
*/
async function putLinks(data, message) {
  // 显式引用入参，避免静态检查提示未使用
  void data;
  void message;
  throw new Error(buildReadonlyMessage("修改数据"));
}

window.DataWriter = { putLinks, buildReadonlyMessage };
