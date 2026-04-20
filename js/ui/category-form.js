/*
文件功能：
新增分类表单模块 —— 提供"+ 新增分类"按钮与输入框，收集分类名并回调提交
*/

// -------------------- 内部函数：createAddCategoryModal --------------------
/*
功能：构造新增分类模态框，返回 show / hide 控制器
输入：
  onSubmit: (name) => Promise<void>，提交回调；抛错时会显示错误
输出：
  { show, hide }
*/
function createAddCategoryModal(onSubmit) {
  // 构造 DOM 骨架
  const mask = document.createElement("div");
  mask.className = "modal-mask hidden";
  mask.innerHTML = `
    <div class="modal modal-small">
      <h3>新增分类</h3>
      <label>分类名<input type="text" class="f-name" placeholder="例如：工具" /></label>
      <p class="m-err"></p>
      <div class="modal-actions">
        <button class="m-cancel">取消</button>
        <button class="m-ok">提交</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  // 取出内部元素
  const nameInput = mask.querySelector(".f-name");
  const errBox    = mask.querySelector(".m-err");
  const btnOk     = mask.querySelector(".m-ok");
  const btnCancel = mask.querySelector(".m-cancel");

  // 显示：清空输入和错误
  function show() {
    nameInput.value = "";
    errBox.textContent = "";
    mask.classList.remove("hidden");
    nameInput.focus();
  }
  // 隐藏模态框
  function hide() { mask.classList.add("hidden"); }

  // 提交：禁用按钮，等待回调成功后关闭；失败时显示错误
  async function trySubmit() {
    btnOk.disabled = true;
    errBox.textContent = "提交中...";
    try {
      await onSubmit(nameInput.value);
      hide();
    } catch (e) {
      errBox.textContent = e.message || String(e);
    } finally {
      btnOk.disabled = false;
    }
  }

  // 输入框回车：提交
  nameInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      trySubmit();
    }
  });

  // 点击提交按钮
  btnOk.addEventListener("click", trySubmit);

  // 取消 + 点击遮罩关闭
  btnCancel.addEventListener("click", hide);
  mask.addEventListener("click", e => { if (e.target === mask) hide(); });

  return { show, hide };
}

// -------------------- 函数：initAddCategoryButton --------------------
/*
功能：初始化"+ 新增分类"按钮和模态框，登录状态变化时控制可见性
输入：
  btn: HTMLElement，新增分类按钮
  onSubmit: (name) => Promise<void>，提交回调
输出：
  { syncVisibility }：外部在登录状态变化时调用
*/
function initAddCategoryButton(btn, onSubmit) {
  // 构造模态框
  const modal = createAddCategoryModal(onSubmit);

  // 点击按钮：弹出表单
  btn.addEventListener("click", () => modal.show());

  // 根据登录状态切换按钮显隐
  function syncVisibility() {
    btn.classList.toggle("hidden", !window.LogicAuth.isLoggedIn());
  }
  syncVisibility();

  return { syncVisibility };
}

window.UICategoryForm = { initAddCategoryButton };
