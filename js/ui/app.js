/*
文件功能：
应用主入口 —— 持有原始数据与筛选状态，串联读取 / 过滤 / 渲染 / 管理员登录 / 新增删除编辑条目 / 新增删除分类
*/

// -------------------- 状态 --------------------
/*
rawData: 从数据源拉到的完整数据（不修改）
state: 当前筛选条件
addButtonCtrl: 新增条目按钮控制器
addCategoryButtonCtrl: 新增分类按钮控制器
editModalCtrl: 编辑条目模态框控制器
*/
let rawData = { categories: [], items: [] };
const state = { keyword: "", category: "" };
let addButtonCtrl = null;
let addCategoryButtonCtrl = null;
let editModalCtrl = null;

// -------------------- 函数：isReadOnlyLocalData --------------------
/*
功能：判断当前是否启用了本地 data 只读模式
输入：无
输出：
  boolean，true 表示所有修改操作都应被拦截
*/
function isReadOnlyLocalData() {
  return !!window.APP_CONFIG.READ_ONLY_LOCAL_DATA;
}

// -------------------- 函数：notifyReadOnlyUnsupported --------------------
/*
功能：弹窗提示本地 data 只读模式下不支持当前修改动作
输入：
  action: string，当前尝试执行的动作名称
输出：无
*/
function notifyReadOnlyUnsupported(action) {
  // 复用统一提示文案，保持所有入口提示一致
  alert(window.DataWriter.buildReadonlyMessage(action));
}

// -------------------- 函数：refresh --------------------
/*
功能：按当前 state 过滤并重新渲染
输入：无
输出：无
*/
function refresh() {
  const navRoot = document.getElementById("nav-root");

  // 过滤条目
  const filteredItems = window.LogicFilter.filterItems(
    rawData.items, state.keyword, state.category
  );

  // 没有命中时显示空态
  if (filteredItems.length === 0) {
    navRoot.innerHTML = `<p class="empty">没有匹配的条目</p>`;
    return;
  }

  // 选中单个分类时只渲染该分类，否则渲染所有分类
  const cats = state.category ? [state.category] : rawData.categories;

  // 渲染时传入登录状态和编辑/删除/拖拽回调
  window.UIRender.renderNav(navRoot, { categories: cats, items: filteredItems }, {
    isAdmin: window.LogicAuth.isLoggedIn(),
    onEdit: handleEditItem,
    onDelete: handleDeleteItem,
    onReorder: handleReorderItems
  });
}

// -------------------- 函数：reloadData --------------------
/*
功能：重新从数据源拉取数据并刷新页面
输入：无
输出：Promise<void>
*/
async function reloadData() {
  const navRoot = document.getElementById("nav-root");
  try {
    rawData = await window.DataReader.fetchLinks();
    refresh();
  } catch (err) {
    navRoot.innerHTML = `<p class="error">重新加载失败：${err.message}</p>`;
  }
}

// -------------------- 函数：handleAddItem --------------------
/*
功能：新增条目的提交回调
输入：
  input: {title, url, category}
输出：
  Promise<void>
*/
async function handleAddItem(input) {
  // 本地 data 只读模式下直接提示，不再尝试写入
  if (isReadOnlyLocalData()) {
    notifyReadOnlyUnsupported("新增条目");
    return;
  }

  const newData = window.LogicItems.addItem(rawData, input);
  await window.DataWriter.putLinks(newData, "新增条目: " + input.title);
  await reloadData();
}

// -------------------- 函数：handleEditItem --------------------
/*
功能：编辑条目的回调
输入：
  item: {id, title, url, category}
输出：无
*/
function handleEditItem(item) {
  // 本地 data 只读模式下直接提示，不再打开编辑模态框
  if (isReadOnlyLocalData()) {
    void item;
    notifyReadOnlyUnsupported("编辑条目");
    return;
  }

  if (editModalCtrl) editModalCtrl.showEdit(item);
}

// -------------------- 函数：handleUpdateItem --------------------
/*
功能：更新条目的提交回调
输入：
  id: string
  input: {title, url, category}
输出：
  Promise<void>
*/
async function handleUpdateItem(id, input) {
  // 本地 data 只读模式下直接提示，不再尝试写入
  if (isReadOnlyLocalData()) {
    void id;
    void input;
    notifyReadOnlyUnsupported("编辑条目");
    return;
  }

  const newData = window.LogicItems.updateItem(rawData, id, input);
  await window.DataWriter.putLinks(newData, "编辑条目: " + input.title);
  await reloadData();
}

// -------------------- 函数：handleDeleteItem --------------------
/*
功能：删除条目的回调
输入：
  id: string
  title: string
输出：无
*/
async function handleDeleteItem(id, title) {
  // 本地 data 只读模式下直接提示，不再尝试删除
  if (isReadOnlyLocalData()) {
    void id;
    void title;
    notifyReadOnlyUnsupported("删除条目");
    return;
  }

  if (!confirm(`确定删除"${title}"吗？`)) return;

  try {
    const newData = window.LogicItems.removeItem(rawData, id);
    await window.DataWriter.putLinks(newData, "删除条目: " + title);
    await reloadData();
  } catch (err) {
    alert("删除失败: " + err.message);
  }
}

// -------------------- 函数：handleReorderItems --------------------
/*
功能：拖拽排序的回调
输入：
  newOrder: string[]，新的条目 id 顺序
输出：无
*/
async function handleReorderItems(newOrder) {
  // 本地 data 只读模式下直接提示，不再尝试排序
  if (isReadOnlyLocalData()) {
    void newOrder;
    notifyReadOnlyUnsupported("调整条目顺序");
    return;
  }

  try {
    const newData = window.LogicItems.reorderItems(rawData, newOrder);
    await window.DataWriter.putLinks(newData, "调整条目顺序");
    await reloadData();
  } catch (err) {
    alert("排序失败: " + err.message);
  }
}

// -------------------- 函数：handleAddCategory --------------------
/*
功能：新增分类的提交回调
输入：
  name: string
输出：
  Promise<void>
*/
async function handleAddCategory(name) {
  // 本地 data 只读模式下直接提示，不再尝试写入
  if (isReadOnlyLocalData()) {
    void name;
    notifyReadOnlyUnsupported("新增分类");
    return;
  }

  const newData = window.LogicItems.addCategory(rawData, name);
  await window.DataWriter.putLinks(newData, "新增分类: " + name);
  await reloadData();
  // 重新渲染分类栏
  renderCategoryBar();
}

// -------------------- 函数：handleDeleteCategory --------------------
/*
功能：删除分类的回调（同时删除该分类下的所有条目）
输入：
  name: string
输出：无
*/
async function handleDeleteCategory(name) {
  // 本地 data 只读模式下直接提示，不再尝试删除
  if (isReadOnlyLocalData()) {
    void name;
    notifyReadOnlyUnsupported("删除分类");
    return;
  }

  // 统计该分类下有多少个条目
  const itemCount = rawData.items.filter(it => it.category === name).length;

  // 构造确认提示文本
  let confirmMsg = `确定删除分类"${name}"吗？`;
  if (itemCount > 0) {
    confirmMsg += `\n\n该分类下有 ${itemCount} 个栏目，将一并删除。`;
  }

  if (!confirm(confirmMsg)) return;

  try {
    const newData = window.LogicItems.removeCategory(rawData, name);
    await window.DataWriter.putLinks(newData, "删除分类: " + name);
    // 如果当前选中的就是被删除的分类，切换到"全部"
    if (state.category === name) state.category = "";
    await reloadData();
    // 重新渲染分类栏
    renderCategoryBar();
  } catch (err) {
    alert("删除失败: " + err.message);
  }
}

// -------------------- 函数：renderCategoryBar --------------------
/*
功能：渲染分类按钮栏（抽取出来方便复用）
输入：无
输出：无
*/
function renderCategoryBar() {
  const bar = document.getElementById("category-bar");
  const onCategoryChange = cat => {
    state.category = cat;
    renderCategoryBar();
    refresh();
  };
  window.UIToolbar.renderCategoryBar(
    bar,
    rawData.categories,
    state.category,
    onCategoryChange,
    {
      isAdmin: window.LogicAuth.isLoggedIn(),
      onDelete: handleDeleteCategory
    }
  );
}

// -------------------- 函数：bindEvents --------------------
/*
功能：绑定搜索框、分类栏、管理员按钮、新增按钮的事件
输入：无
输出：无
*/
function bindEvents() {
  // 搜索框输入时更新关键词并刷新
  const input = document.getElementById("search-input");
  input.addEventListener("input", e => {
    state.keyword = e.target.value;
    refresh();
  });

  // 首次渲染分类栏
  renderCategoryBar();

  // 初始化管理员登录按钮；登录状态变化时刷新页面 + 同步按钮可见性
  const adminBtn = document.getElementById("admin-btn");
  window.UIAdmin.initAdminUI(adminBtn, () => {
    refresh();
    renderCategoryBar();
    if (addButtonCtrl) addButtonCtrl.syncVisibility();
    if (addCategoryButtonCtrl) addCategoryButtonCtrl.syncVisibility();
  });

  // 初始化新增条目按钮
  const addBtn = document.getElementById("add-btn");
  addButtonCtrl = window.UIItemForm.initAddButton(
    addBtn,
    () => rawData,
    handleAddItem,
    {
      onBeforeOpen: () => {
        // 本地 data 只读模式下直接提示，不再打开新增弹窗
        if (!isReadOnlyLocalData()) return true;
        notifyReadOnlyUnsupported("新增条目");
        return false;
      }
    }
  );

  // 初始化编辑条目模态框
  editModalCtrl = window.UIItemForm.initEditModal(
    () => rawData,
    handleUpdateItem
  );

  // 初始化新增分类按钮
  const addCategoryBtn = document.getElementById("add-category-btn");
  addCategoryButtonCtrl = window.UICategoryForm.initAddCategoryButton(
    addCategoryBtn,
    handleAddCategory,
    {
      onBeforeOpen: () => {
        // 本地 data 只读模式下直接提示，不再打开新增分类弹窗
        if (!isReadOnlyLocalData()) return true;
        notifyReadOnlyUnsupported("新增分类");
        return false;
      }
    }
  );
}

// -------------------- 主函数 --------------------
(async function main() {
  const navRoot = document.getElementById("nav-root");

  try {
    // 拉取原始数据
    rawData = await window.DataReader.fetchLinks();
    // 绑定交互事件
    bindEvents();
    // 首次渲染列表
    refresh();
  } catch (err) {
    navRoot.innerHTML = `<p class="error">加载失败：${err.message}</p>`;
  }
})();
