/*
文件功能：
工具栏模块 —— 渲染分类按钮栏，处理分类切换和删除事件
*/

// -------------------- 函数：renderCategoryBar --------------------
/*
功能：把分类列表渲染成可点击的按钮栏
输入：
  container: HTMLElement，按钮容器
  categories: string[]，分类名数组
  activeCategory: string，当前选中的分类（空字符串表示"全部"）
  onChange: (category: string) => void，点击回调
  options: {
    isAdmin: boolean，是否管理员模式
    onDelete: (category: string) => void，删除回调
  }
输出：无
*/
function renderCategoryBar(container, categories, activeCategory, onChange, options = {}) {
  // 清空旧按钮
  container.innerHTML = "";

  // 解构选项
  const { isAdmin = false, onDelete = null } = options;

  // "全部" 按钮 + 各分类按钮拼成完整列表
  const all = [""].concat(categories);

  // 逐个生成按钮
  all.forEach(cat => {
    // 按钮容器（相对定位，用于放置删除按钮）
    const wrapper = document.createElement("div");
    wrapper.className = "cat-btn-wrapper";

    // 分类按钮
    const btn = document.createElement("button");
    btn.className = "cat-btn" + (cat === activeCategory ? " active" : "");
    btn.textContent = cat === "" ? "全部" : cat;
    btn.addEventListener("click", () => onChange(cat));
    wrapper.appendChild(btn);

    // 管理员模式下，非"全部"按钮加删除按钮
    if (isAdmin && cat !== "" && onDelete) {
      const delBtn = document.createElement("button");
      delBtn.className = "cat-del";
      delBtn.textContent = "×";
      delBtn.title = "删除分类";
      delBtn.addEventListener("click", e => {
        e.stopPropagation();
        onDelete(cat);
      });
      wrapper.appendChild(delBtn);
    }

    container.appendChild(wrapper);
  });
}

window.UIToolbar = { renderCategoryBar };
