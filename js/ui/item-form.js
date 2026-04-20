/*
文件功能：
条目表单模块 —— 提供新增和编辑条目的按钮与模态框
*/

// -------------------- 内部函数：createAddModal --------------------
/*
功能：构造新增条目模态框，返回 show(categories) / hide 控制器
输入：
  onSubmit: (input) => Promise<void>，提交回调；抛错时会显示错误
输出：
  { show, hide }
*/
function createAddModal(onSubmit) {
  // 构造 DOM 骨架
  const mask = document.createElement("div");
  mask.className = "modal-mask hidden";
  mask.innerHTML = `
    <div class="modal">
      <h3>新增条目</h3>
      <label>标题<input type="text" class="f-title" /></label>
      <label>网址<input type="text" class="f-url" placeholder="https://..." /></label>
      <label>分类<select class="f-category"></select></label>
      <p class="m-err"></p>
      <div class="modal-actions">
        <button class="m-cancel">取消</button>
        <button class="m-ok">提交</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  // 取出内部元素
  const titleInput = mask.querySelector(".f-title");
  const urlInput   = mask.querySelector(".f-url");
  const catSelect  = mask.querySelector(".f-category");
  const errBox     = mask.querySelector(".m-err");
  const btnOk      = mask.querySelector(".m-ok");
  const btnCancel  = mask.querySelector(".m-cancel");

  // 显示：根据传入分类填充下拉，清空其他字段
  function show(categories) {
    titleInput.value = "";
    urlInput.value = "";
    errBox.textContent = "";
    catSelect.innerHTML = categories
      .map(c => `<option value="${c}">${c}</option>`)
      .join("");
    mask.classList.remove("hidden");
    titleInput.focus();
  }
  // 隐藏模态框
  function hide() { mask.classList.add("hidden"); }

  // 提交：禁用按钮，等待回调成功后关闭；失败时显示错误
  btnOk.addEventListener("click", async () => {
    btnOk.disabled = true;
    errBox.textContent = "提交中...";
    try {
      await onSubmit({
        title: titleInput.value,
        url: urlInput.value,
        category: catSelect.value
      });
      hide();
    } catch (e) {
      errBox.textContent = e.message || String(e);
    } finally {
      btnOk.disabled = false;
    }
  });

  // 取消 + 点击遮罩关闭
  btnCancel.addEventListener("click", hide);
  mask.addEventListener("click", e => { if (e.target === mask) hide(); });

  return { show, hide };
}

// -------------------- 函数：initAddButton --------------------
/*
功能：初始化"+ 新增条目"按钮和模态框，登录状态变化时控制可见性
输入：
  btn: HTMLElement，新增按钮
  getState: () => {categories, items}，获取当前数据快照
  onSubmit: (input) => Promise<void>，提交回调
输出：
  { syncVisibility }：外部在登录状态变化时调用
*/
function initAddButton(btn, getState, onSubmit) {
  // 构造模态框
  const modal = createAddModal(onSubmit);

  // 点击按钮：弹出表单并把当前分类列表传进去
  btn.addEventListener("click", () => {
    const data = getState();
    if (data.categories.length === 0) {
      alert("暂无分类，无法新增条目");
      return;
    }
    modal.show(data.categories);
  });

  // 根据登录状态切换按钮显隐
  function syncVisibility() {
    btn.classList.toggle("hidden", !window.LogicAuth.isLoggedIn());
  }
  syncVisibility();

  return { syncVisibility };
}

// -------------------- 内部函数：createEditModal --------------------
/*
功能：构造编辑条目模态框，返回 show(item, categories) / hide 控制器
输入：
  onSubmit: (id, input) => Promise<void>，提交回调；抛错时会显示错误
输出：
  { show, hide }
*/
function createEditModal(onSubmit) {
  // 构造 DOM 骨架
  const mask = document.createElement("div");
  mask.className = "modal-mask hidden";
  mask.innerHTML = `
    <div class="modal">
      <h3>编辑条目</h3>
      <label>标题<input type="text" class="f-title" /></label>
      <label>网址<input type="text" class="f-url" placeholder="https://..." /></label>
      <label>分类<select class="f-category"></select></label>
      <p class="m-err"></p>
      <div class="modal-actions">
        <button class="m-cancel">取消</button>
        <button class="m-ok">保存</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  // 取出内部元素
  const titleInput = mask.querySelector(".f-title");
  const urlInput   = mask.querySelector(".f-url");
  const catSelect  = mask.querySelector(".f-category");
  const errBox     = mask.querySelector(".m-err");
  const btnOk      = mask.querySelector(".m-ok");
  const btnCancel  = mask.querySelector(".m-cancel");

  // 当前编辑的条目 id
  let currentId = null;

  // 显示：根据传入条目预填充，根据分类列表填充下拉
  function show(item, categories) {
    currentId = item.id;
    titleInput.value = item.title;
    urlInput.value = item.url;
    errBox.textContent = "";
    catSelect.innerHTML = categories
      .map(c => `<option value="${c}" ${c === item.category ? "selected" : ""}>${c}</option>`)
      .join("");
    mask.classList.remove("hidden");
    titleInput.focus();
  }
  // 隐藏模态框
  function hide() { mask.classList.add("hidden"); }

  // 提交：禁用按钮，等待回调成功后关闭；失败时显示错误
  btnOk.addEventListener("click", async () => {
    btnOk.disabled = true;
    errBox.textContent = "提交中...";
    try {
      await onSubmit(currentId, {
        title: titleInput.value,
        url: urlInput.value,
        category: catSelect.value
      });
      hide();
    } catch (e) {
      errBox.textContent = e.message || String(e);
    } finally {
      btnOk.disabled = false;
    }
  });

  // 取消 + 点击遮罩关闭
  btnCancel.addEventListener("click", hide);
  mask.addEventListener("click", e => { if (e.target === mask) hide(); });

  return { show, hide };
}

// -------------------- 函数：initEditModal --------------------
/*
功能：初始化编辑模态框（不需要按钮，由卡片上的编辑按钮触发）
输入：
  getState: () => {categories, items}，获取当前数据快照
  onSubmit: (id, input) => Promise<void>，提交回调
输出：
  { showEdit }：外部调用 showEdit(item) 打开编辑框
*/
function initEditModal(getState, onSubmit) {
  const modal = createEditModal(onSubmit);

  function showEdit(item) {
    const data = getState();
    if (data.categories.length === 0) {
      alert("暂无分类，无法编辑条目");
      return;
    }
    modal.show(item, data.categories);
  }

  return { showEdit };
}

window.UIItemForm = { initAddButton, initEditModal };
