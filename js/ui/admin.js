/*
文件功能：
管理界面模块 —— 登录按钮、登录表单模态框、登录状态切换
*/

// -------------------- 内部：构造模态框 --------------------
/*
功能：创建登录模态框 DOM（首次调用时插入到 body，后续复用）
输入：
  onSubmit: (user, pass) => boolean，提交回调，返回是否成功
输出：
  { show, hide }：控制模态框显示/隐藏
*/
function createLoginModal(onSubmit) {
  // 构造遮罩和对话框结构
  const mask = document.createElement("div");
  mask.className = "modal-mask hidden";
  mask.innerHTML = `
    <div class="modal">
      <h3>管理员登录</h3>
      <label>账号<input type="text" class="m-user" /></label>
      <label>密码<input type="password" class="m-pass" /></label>
      <p class="m-err"></p>
      <div class="modal-actions">
        <button class="m-cancel">取消</button>
        <button class="m-ok">登录</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  // 取出内部元素
  const userInput = mask.querySelector(".m-user");
  const passInput = mask.querySelector(".m-pass");
  const errBox    = mask.querySelector(".m-err");
  const btnOk     = mask.querySelector(".m-ok");
  const btnCancel = mask.querySelector(".m-cancel");

  // 显示时清空输入和错误提示
  function show() {
    userInput.value = "";
    passInput.value = "";
    errBox.textContent = "";
    mask.classList.remove("hidden");
    userInput.focus();
  }
  // 隐藏模态框
  function hide() { mask.classList.add("hidden"); }

  // 提交登录的统一逻辑
  function tryLogin() {
    const ok = onSubmit(userInput.value, passInput.value);
    if (ok) hide();
    else errBox.textContent = "账号或密码错误";
  }

  // 账号输入框回车：跳到密码框
  userInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      passInput.focus();
    }
  });

  // 密码输入框回车：提交登录
  passInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      tryLogin();
    }
  });

  // 点击登录按钮：提交登录
  btnOk.addEventListener("click", tryLogin);

  // 取消关闭 + 点击遮罩空白关闭
  btnCancel.addEventListener("click", hide);
  mask.addEventListener("click", e => { if (e.target === mask) hide(); });

  return { show, hide };
}

// -------------------- 函数：initAdminUI --------------------
/*
功能：初始化顶部登录按钮 + 登录模态框，绑定登录/退出事件
输入：
  btn: HTMLElement，顶部登录按钮
  onChange: () => void，登录状态变化时的回调（用于外部刷新页面）
输出：无
*/
function initAdminUI(btn, onChange) {
  // 根据当前登录状态更新按钮文案和样式
  function syncBtn() {
    const logged = window.LogicAuth.isLoggedIn();
    btn.textContent = logged ? "退出登录" : "管理员登录";
    btn.classList.toggle("admin-on", logged);
  }

  // 创建登录模态框，传入提交回调
  const modal = createLoginModal((user, pass) => {
    const ok = window.LogicAuth.login(user, pass);
    if (ok) { syncBtn(); onChange(); }
    return ok;
  });

  // 按钮点击：已登录则退出；未登录则弹框
  btn.addEventListener("click", () => {
    if (window.LogicAuth.isLoggedIn()) {
      window.LogicAuth.logout();
      syncBtn();
      onChange();
    } else {
      modal.show();
    }
  });

  // 首次进入同步一次按钮状态
  syncBtn();
}

window.UIAdmin = { initAdminUI };
