/*
文件功能：
条目管理模块 —— 生成 id、新增条目，维护数据结构不可变性
*/

// -------------------- 函数：genId --------------------
/*
功能：生成一个短的、基本唯一的条目 id
输入：无
输出：
  string，形如 "lx8z1p2k3m"
*/
function genId() {
  // 时间戳 + 随机后缀，避免同一毫秒内并发冲突
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// -------------------- 函数：addItem --------------------
/*
功能：在不修改原数据的前提下，返回追加一条新条目后的数据
输入：
  data: {categories, items}，原始数据
  input: {title, url, category}，新条目字段
输出：
  {categories, items}，新数据对象（items 末尾追加新条目，并补上 id）
*/
function addItem(data, input) {
  // 字段校验
  const title    = (input.title    || "").trim();
  const url      = (input.url      || "").trim();
  const category = (input.category || "").trim();
  if (!title)    throw new Error("标题不能为空");
  if (!url)      throw new Error("网址不能为空");
  if (!category) throw new Error("分类不能为空");

  // 构造新条目
  const newItem = { id: genId(), title, url, category };

  // 返回新数据对象（浅拷贝数组，防止外部引用被污染）
  return {
    categories: data.categories.slice(),
    items:      data.items.concat([newItem])
  };
}

// -------------------- 函数：removeItem --------------------
/*
功能：在不修改原数据的前提下，返回删除指定 id 条目后的数据
输入：
  data: {categories, items}，原始数据
  id: string，要删除的条目 id
输出：
  {categories, items}，新数据对象（items 中过滤掉目标条目）
*/
function removeItem(data, id) {
  // 过滤掉目标 id
  const newItems = data.items.filter(it => it.id !== id);

  // 检查是否真的删除了（id 不存在时提示）
  if (newItems.length === data.items.length) {
    throw new Error("条目不存在: " + id);
  }

  // 返回新数据对象
  return {
    categories: data.categories.slice(),
    items: newItems
  };
}

// -------------------- 函数：addCategory --------------------
/*
功能：在不修改原数据的前提下，返回新增分类后的数据
输入：
  data: {categories, items}，原始数据
  name: string，新分类名
输出：
  {categories, items}，新数据对象（categories 末尾追加新分类）
*/
function addCategory(data, name) {
  // 字段校验
  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("分类名不能为空");

  // 检查重复
  if (data.categories.includes(trimmed)) {
    throw new Error("分类已存在: " + trimmed);
  }

  // 返回新数据对象
  return {
    categories: data.categories.concat([trimmed]),
    items: data.items.slice()
  };
}

// -------------------- 函数：removeCategory --------------------
/*
功能：在不修改原数据的前提下，返回删除指定分类后的数据
输入：
  data: {categories, items}，原始数据
  name: string，要删除的分类名
输出：
  {categories, items}，新数据对象（categories 中过滤掉目标分类）
*/
function removeCategory(data, name) {
  // 检查分类是否存在
  if (!data.categories.includes(name)) {
    throw new Error("分类不存在: " + name);
  }

  // 检查分类下是否有条目
  const hasItems = data.items.some(it => it.category === name);
  if (hasItems) {
    throw new Error("该分类下还有条目，请先删除所有条目");
  }

  // 过滤掉目标分类
  return {
    categories: data.categories.filter(c => c !== name),
    items: data.items.slice()
  };
}

// -------------------- 函数：updateItem --------------------
/*
功能：在不修改原数据的前提下，返回更新指定 id 条目后的数据
输入：
  data: {categories, items}，原始数据
  id: string，要更新的条目 id
  input: {title, url, category}，新字段值
输出：
  {categories, items}，新数据对象（items 中替换目标条目）
*/
function updateItem(data, id, input) {
  // 字段校验
  const title    = (input.title    || "").trim();
  const url      = (input.url      || "").trim();
  const category = (input.category || "").trim();
  if (!title)    throw new Error("标题不能为空");
  if (!url)      throw new Error("网址不能为空");
  if (!category) throw new Error("分类不能为空");

  // 查找目标条目索引
  const idx = data.items.findIndex(it => it.id === id);
  if (idx === -1) throw new Error("条目不存在: " + id);

  // 构造新条目（保留原 id）
  const updatedItem = { id, title, url, category };

  // 返回新数据对象（替换目标条目）
  const newItems = data.items.slice();
  newItems[idx] = updatedItem;

  return {
    categories: data.categories.slice(),
    items: newItems
  };
}

// -------------------- 函数：reorderItems --------------------
/*
功能：在不修改原数据的前提下，返回按新顺序重排条目后的数据
输入：
  data: {categories, items}，原始数据
  newOrder: string[]，新的条目 id 顺序数组
输出：
  {categories, items}，新数据对象（items 按 newOrder 重排）
*/
function reorderItems(data, newOrder) {
  // 构造 id -> item 的映射
  const itemMap = {};
  data.items.forEach(it => { itemMap[it.id] = it; });

  // 按 newOrder 重建 items 数组
  const reordered = newOrder.map(id => itemMap[id]).filter(Boolean);

  // 检查是否有遗漏（newOrder 中没有的条目追加到末尾）
  const orderSet = new Set(newOrder);
  const missing = data.items.filter(it => !orderSet.has(it.id));

  return {
    categories: data.categories.slice(),
    items: reordered.concat(missing)
  };
}

window.LogicItems = { genId, addItem, removeItem, updateItem, addCategory, removeCategory, reorderItems };
