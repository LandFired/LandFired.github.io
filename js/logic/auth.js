/*
文件功能：
认证模块 —— 校验管理员账号密码，读写登录状态
*/

// -------------------- 常量 --------------------
// sessionStorage 中存放登录标记的 key
const AUTH_KEY = "nav_admin_logged_in";

// -------------------- 函数：login --------------------
/*
功能：校验账号密码，成功则写入登录状态
输入：
  user: string，账号
  pass: string，密码
输出：
  boolean，是否登录成功
*/
function login(user, pass) {
  // 与 APP_CONFIG 中的账号密码比对
  const cfg = window.APP_CONFIG;
  const ok = user === cfg.ADMIN_USER && pass === cfg.ADMIN_PASS;

  // 成功时写入 sessionStorage
  if (ok) sessionStorage.setItem(AUTH_KEY, "1");
  return ok;
}

// -------------------- 函数：logout --------------------
/*
功能：清除登录状态
输入：无
输出：无
*/
function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}

// -------------------- 函数：isLoggedIn --------------------
/*
功能：判断当前是否处于管理员登录状态
输入：无
输出：
  boolean
*/
function isLoggedIn() {
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

window.LogicAuth = { login, logout, isLoggedIn };
