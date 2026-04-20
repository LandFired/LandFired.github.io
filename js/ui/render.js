/*
文件功能：
导航展示模块 —— 把数据渲染成分类分组的卡片列表，管理员登录时支持编辑/删除/拖拽排序
*/

// -------------------- 函数：renderNav --------------------
/*
功能：按分类渲染导航条目到指定容器
输入：
  container: HTMLElement
  data: {categories, items}
  options: {
    isAdmin: boolean，是否管理员模式
    onEdit: (item) => void，编辑回调
    onDelete: (id, title) => void，删除回调
    onReorder: (newOrder: string[]) => void，拖拽排序回调
  }
输出：无
*/
function renderNav(container, data, options = {}) {
  // 清空旧内容
  container.innerHTML = "";

  // 解构选项
  const { isAdmin = false, onEdit = null, onDelete = null, onReorder = null } = options;

  // 拖拽状态
  let draggedId = null;
  let dropTargetId = null;

  // 按分类分组
  data.categories.forEach(cat => {
    const items = data.items.filter(it => it.category === cat);
    if (items.length === 0) return;

    // 构造分类区块
    const section = document.createElement("section");
    section.className = "category";
    section.innerHTML = `<h2>${cat}</h2>`;

    // 构造条目卡片
    const grid = document.createElement("div");
    grid.className = "grid";
    items.forEach(it => {
      // 卡片容器（相对定位，用于放置按钮）
      const wrapper = document.createElement("div");
      wrapper.className = "card-wrapper";
      wrapper.dataset.id = it.id;

      // 链接卡片
      const a = document.createElement("a");
      a.href = it.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "card";
      a.textContent = it.title;

      // 管理员模式下卡片可拖拽
      if (isAdmin && onReorder) {
        a.draggable = true;

        // 拖拽开始：记录被拖拽的 id，添加拖拽样式
        a.addEventListener("dragstart", e => {
          draggedId = it.id;
          wrapper.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });

        // 拖拽结束：清除样式
        a.addEventListener("dragend", () => {
          wrapper.classList.remove("dragging");
          // 清除所有 drop-target 样式
          document.querySelectorAll(".drop-target").forEach(el => el.classList.remove("drop-target"));
        });

        // 拖拽经过：显示插入提示
        wrapper.addEventListener("dragover", e => {
          e.preventDefault();
          if (draggedId === it.id) return;
          dropTargetId = it.id;
          wrapper.classList.add("drop-target");
        });

        // 拖拽离开：移除插入提示
        wrapper.addEventListener("dragleave", () => {
          wrapper.classList.remove("drop-target");
        });

        // 放置：计算新顺序并触发回调
        wrapper.addEventListener("drop", e => {
          e.preventDefault();
          wrapper.classList.remove("drop-target");

          if (!draggedId || draggedId === dropTargetId) return;

          // 计算新顺序：把 draggedId 移到 dropTargetId 前面
          const oldOrder = data.items.map(item => item.id);
          const newOrder = [];
          oldOrder.forEach(id => {
            if (id === draggedId) return; // 跳过被拖拽的
            if (id === dropTargetId) newOrder.push(draggedId); // 插入到目标前
            newOrder.push(id);
          });
          // 如果目标是最后一个，追加到末尾
          if (!newOrder.includes(draggedId)) newOrder.push(draggedId);

          onReorder(newOrder);
        });
      }

      wrapper.appendChild(a);

      // 管理员模式下加编辑和删除按钮
      if (isAdmin) {
        // 编辑按钮
        if (onEdit) {
          const editBtn = document.createElement("button");
          editBtn.className = "card-edit";
          editBtn.textContent = "✎";
          editBtn.title = "编辑";
          editBtn.addEventListener("click", e => {
            e.stopPropagation();
            onEdit(it);
          });
          wrapper.appendChild(editBtn);
        }

        // 删除按钮
        if (onDelete) {
          const delBtn = document.createElement("button");
          delBtn.className = "card-del";
          delBtn.textContent = "×";
          delBtn.title = "删除";
          delBtn.addEventListener("click", e => {
            e.stopPropagation();
            onDelete(it.id, it.title);
          });
          wrapper.appendChild(delBtn);
        }
      }

      grid.appendChild(wrapper);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

window.UIRender = { renderNav };
