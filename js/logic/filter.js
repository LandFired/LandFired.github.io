/*
文件功能：
过滤模块 —— 按关键词和分类组合筛选条目
*/

// -------------------- 函数：filterItems --------------------
/*
功能：根据关键词和分类过滤条目列表
输入：
  items: object[]，原始条目数组
  keyword: string，搜索关键词（大小写不敏感，匹配 title 和 url）
  category: string，分类名，空字符串表示"全部"
输出：
  object[]，过滤后的条目数组
*/
function filterItems(items, keyword, category) {
  // 归一化关键词
  const kw = (keyword || "").trim().toLowerCase();

  // 逐条判断是否命中
  return items.filter(it => {
    // 分类条件：未选分类时通过；选了分类必须匹配
    const catHit = !category || it.category === category;

    // 关键词条件：为空时通过；否则 title 或 url 包含关键词
    const kwHit = !kw
      || it.title.toLowerCase().includes(kw)
      || it.url.toLowerCase().includes(kw);

    return catHit && kwHit;
  });
}

window.LogicFilter = { filterItems };
